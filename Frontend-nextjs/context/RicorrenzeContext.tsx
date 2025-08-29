"use client";

/* ╔══════════════════════════════════════════════════════════════╗
 * ║ RicorrenzeContext — CRUD + Modale + Undo (Sonner)           ║
 * ║ Cache a livello di modulo + coalescing delle fetch           ║
 * ╚══════════════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Ricorrenza, RicorrenzaBase } from "@/types/models/ricorrenza";
import { fetchRicorrenze, createRicorrenza, updateRicorrenza, deleteRicorrenza } from "@/lib/api/ricorrenzeApi";
import { normalizeRicorrenza } from "@/utils/normalizeRicorrenza";
import NewRicorrenzaModal from "@/app/(protected)/newRicorrenza/NewRicorrenzaModal";

/* ────────────────────────────────────────────────────────────────
 * Cache & promise a livello di modulo
 * ──────────────────────────────────────────────────────────────── */
let ricorrenzeCache: Ricorrenza[] | null = null;
let ricorrenzePromise: Promise<Ricorrenza[]> | null = null;
let ricorrenzeToken: string | undefined;

/* ===============================================================
 * Tipi del context
 * =============================================================== */
type RicorrenzeContextType = {
    ricorrenze: Ricorrenza[];
    loading: boolean;
    error: string | null;

    refresh: () => void;
    create: (data: RicorrenzaBase) => Promise<void>;
    update: (id: number, data: RicorrenzaBase) => Promise<void>;
    remove: (id: number) => Promise<void>;

    // Modale
    isOpen: boolean;
    ricorrenzaToEdit: Ricorrenza | null;
    openModal: (ricorrenzaToEdit?: Ricorrenza | null, onSuccess?: (r: Ricorrenza) => void) => void;
    closeModal: () => void;
};

/* ===============================================================
 * Context base
 * =============================================================== */
const RicorrenzeContext = createContext<RicorrenzeContextType | undefined>(undefined);

/* ===============================================================
 * Provider
 * =============================================================== */
export function RicorrenzeProvider({ children }: { children: ReactNode }) {
    const [ricorrenze, setRicorrenze] = useState<Ricorrenza[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modale
    const [isOpen, setIsOpen] = useState(false);
    const [ricorrenzaToEdit, setRicorrenzaToEdit] = useState<Ricorrenza | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((r: Ricorrenza) => void) | null>(null);

    // Per undo (facoltativo)
    const [lastDeleted, setLastDeleted] = useState<Ricorrenza | null>(null);
    void lastDeleted;

    // Auth
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    /* =============================================================
     * Fetch ricorrenze (cache + coalescing)
     * ============================================================= */
    const loadRicorrenze = useCallback(
        async (force = false) => {
            if (!token) {
                setRicorrenze([]);
                ricorrenzeCache = null;
                ricorrenzePromise = null;
                ricorrenzeToken = undefined;
                setLoading(false);
                return;
            }

            // Cambio utente → invalida cache
            if (ricorrenzeToken !== token) {
                ricorrenzeCache = null;
                ricorrenzePromise = null;
                ricorrenzeToken = token;
            }

            // Usa cache se disponibile e non forzato
            if (!force && ricorrenzeCache) {
                setRicorrenze(ricorrenzeCache);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const promise =
                    ricorrenzePromise ??
                    (async () => {
                        const items = await fetchRicorrenze(token);
                        return items.map(normalizeRicorrenza);
                    })();

                ricorrenzePromise = promise;
                const data = await promise;

                ricorrenzeCache = data;
                setRicorrenze(data);
            } catch (_e: any) {
                setError("Errore caricamento ricorrenze");
                toast.error("Errore caricamento ricorrenze");
            } finally {
                setLoading(false);
                ricorrenzePromise = null;
            }
        },
        [token]
    );

    useEffect(() => {
        if (token) loadRicorrenze();
    }, [token, loadRicorrenze]);

    // Invalida cache e forza il refetch
    const refresh = useCallback(() => {
        ricorrenzeCache = null;
        ricorrenzePromise = null;
        void loadRicorrenze(true);
    }, [loadRicorrenze]);

    /* =============================================================
     * CREATE / UPDATE / DELETE
     * ============================================================= */
    const create = async (data: RicorrenzaBase) => {
        if (!token) return;
        setLoading(true);
        try {
            const nuova = await createRicorrenza(token, data);
            refresh();
            toast.success("Ricorrenza creata!");
            onSuccessCallback?.(nuova);
            closeModal();
        } catch {
            toast.error("Errore creazione ricorrenza");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, data: RicorrenzaBase) => {
        if (!token) return;
        setLoading(true);
        try {
            const aggiornata = await updateRicorrenza(token, id, data);
            refresh();
            toast.success("Ricorrenza aggiornata!");
            onSuccessCallback?.(aggiornata);
            closeModal();
        } catch {
            toast.error("Errore aggiornamento ricorrenza");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            const ric = ricorrenze.find((r) => r.id === id);
            if (!ric) return;

            await deleteRicorrenza(token, ric);
            setLastDeleted(ric);
            refresh();

            toast.success("Ricorrenza eliminata!", {
                description: (
                    <div>
                        <span className="font-semibold">{ric.nome}</span> rimossa.
                        <br />
                        <span className="text-sm text-zinc-500">Puoi annullare questa operazione con il bottone…</span>
                    </div>
                ),
                action: {
                    label: "Ripristina",
                    onClick: async () => {
                        if (!token || !ric) return;
                        setLoading(true);
                        try {
                            const { id: _omit, ...ricBase } = ric;
                            await createRicorrenza(token, ricBase);
                            refresh();
                            toast.success("Eliminazione annullata!");
                        } catch {
                            toast.error("Errore durante l'annullamento.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            });
        } catch (e: any) {
            toast.error(e?.message || "Errore eliminazione ricorrenza");
        } finally {
            setLoading(false);
        }
    };

    /* =============================================================
     * Modale
     * ============================================================= */
    const openModal = (ricorrenza?: Ricorrenza | null, onSuccess?: (r: Ricorrenza) => void) => {
        setRicorrenzaToEdit(ricorrenza ?? null);
        setOnSuccessCallback(() => onSuccess || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setRicorrenzaToEdit(null);
        setOnSuccessCallback(null);
        setIsOpen(false);
    };

    /* =============================================================
     * Render
     * ============================================================= */
    return (
        <RicorrenzeContext.Provider
            value={{
                ricorrenze,
                loading,
                error,
                refresh,
                create,
                update,
                remove,
                isOpen,
                ricorrenzaToEdit,
                openModal,
                closeModal,
            }}
        >
            {children}
            <NewRicorrenzaModal
                open={isOpen}
                onClose={closeModal}
                ricorrenzaToEdit={ricorrenzaToEdit}
                onSave={ricorrenzaToEdit ? (data) => update(ricorrenzaToEdit.id, data) : create}
            />
        </RicorrenzeContext.Provider>
    );
}

/* ===============================================================
 * Hook custom
 * =============================================================== */
export function useRicorrenze() {
    const ctx = useContext(RicorrenzeContext);
    if (!ctx) throw new Error("useRicorrenze deve essere usato dentro <RicorrenzeProvider>");
    return ctx;
}

/* ===============================================================
 * Reset cache (uso interno) — chiamato da resetAllProviderCaches()
 * =============================================================== */
export function __resetRicorrenzeCache() {
    ricorrenzeCache = null;
    ricorrenzePromise = null;
    ricorrenzeToken = undefined;
}
