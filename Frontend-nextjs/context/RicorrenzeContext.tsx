"use client";

// ╔════════════════════════════════════════════════════════════╗
// ║ RicorrenzeContext — CRUD + Undo Delete (Sonner)          ║
// ╚════════════════════════════════════════════════════════════╝

import { createContext, useContext, useState, useEffect } from "react";
import { Ricorrenza, RicorrenzaBase } from "@/types/models/ricorrenza";
import { fetchRicorrenze, createRicorrenza, updateRicorrenza, deleteRicorrenza } from "@/lib/api/ricorrenzeApi";
import { unwrapApiArray } from "@/utils/unwrapApiArray";
import { normalizeRicorrenza } from "@/utils/normalizeRicorrenza";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NewRicorrenzaModal from "@/app/(protected)/newRicorrenza/NewRicorrenzaModal";

// ===========================================================
// Tipizzazione context
// ===========================================================
type RicorrenzeContextType = {
    ricorrenze: Ricorrenza[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
    create: (data: RicorrenzaBase) => Promise<void>;
    update: (id: number, data: RicorrenzaBase) => Promise<void>;
    remove: (id: number) => Promise<void>;
    isOpen: boolean;
    ricorrenzaToEdit: Ricorrenza | null;
    openModal: (ricorrenzaToEdit?: Ricorrenza | null, onSuccess?: (r: Ricorrenza) => void) => void;
    closeModal: () => void;
};

// ===========================================================
// Context base
// ===========================================================
const RicorrenzeContext = createContext<RicorrenzeContextType | undefined>(undefined);

// ===========================================================
// Provider principale
// ===========================================================
export function RicorrenzeProvider({ children }: { children: React.ReactNode }) {
    const [ricorrenze, setRicorrenze] = useState<Ricorrenza[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modale
    const [isOpen, setIsOpen] = useState(false);
    const [ricorrenzaToEdit, setRicorrenzaToEdit] = useState<Ricorrenza | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((r: Ricorrenza) => void) | null>(null);

    // Per undo temporaneo
    const [lastDeleted, setLastDeleted] = useState<Ricorrenza | null>(null);

    // Auth
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // =======================================================
    // Fetch ricorrenze
    // =======================================================
    const loadRicorrenze = async () => {
        if (!token) {
            setRicorrenze([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const items = await fetchRicorrenze(token);
            setRicorrenze(items.map(normalizeRicorrenza));
        } catch (e: any) {
            setError("Errore caricamento ricorrenze");
            toast.error("Errore caricamento ricorrenze");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadRicorrenze();
    }, [token]);

    // =======================================================
    // CREATE
    // =======================================================
    const create = async (data: RicorrenzaBase) => {
        if (!token) {
            toast.error("Utente non autenticato");
            return;
        }
        setLoading(true);
        try {
            const nuova = await createRicorrenza(token, data);
            await loadRicorrenze();
            toast.success("Ricorrenza creata!");
            onSuccessCallback?.(nuova);
            closeModal();
        } catch (e) {
            toast.error("Errore creazione ricorrenza");
        } finally {
            setLoading(false);
        }
    };

    // =======================================================
    // UPDATE
    // =======================================================
    const update = async (id: number, data: RicorrenzaBase) => {
        if (!token) return;
        setLoading(true);
        try {
            const aggiornata = await updateRicorrenza(token, id, data);
            await loadRicorrenze();
            toast.success("Ricorrenza aggiornata!");
            onSuccessCallback?.(aggiornata);
            closeModal();
        } catch (e) {
            toast.error("Errore aggiornamento ricorrenza");
        } finally {
            setLoading(false);
        }
    };

    // =======================================================
    // REMOVE + Undo (Sonner)
    // =======================================================
    const remove = async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            const ric = ricorrenze.find((r) => r.id === id);
            if (!ric) return;

            // 1. Cancella
            await deleteRicorrenza(token, ric);
            setLastDeleted(ric); // Salva per eventuale undo
            await loadRicorrenze();

            // 2. Toast con undo
            toast.success("Ricorrenza eliminata!", {
                description: (
                    <div>
                        <span className="font-semibold">{ric.nome}</span> rimossa.
                        <br />
                        <span className="text-sm text-zinc-500">
                            Puoi annullare questa operazione con il bottone ...
                        </span>
                    </div>
                ),
                action: {
                    label: "Ripristina",
                    onClick: async () => {
                        if (!token || !ric) return;
                        setLoading(true);
                        try {
                            // Ricrea la ricorrenza eliminata (rimuovi id dal payload)
                            const { id, ...ricBase } = ric;
                            await createRicorrenza(token, ricBase);
                            await loadRicorrenze();
                            toast.success("Eliminazione annullata!");
                        } catch (e: any) {
                            toast.error("Errore durante l'annullamento.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            });
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione ricorrenza");
        } finally {
            setLoading(false);
        }
    };

    // =======================================================
    // Gestione Modale
    // =======================================================
    const openModal = (ricorrenza?: Ricorrenza | null, onSuccess?: (r: Ricorrenza) => void) => {
        setRicorrenzaToEdit(ricorrenza || null);
        setOnSuccessCallback(() => onSuccess || null);
        setIsOpen(true);
    };
    const closeModal = () => {
        setRicorrenzaToEdit(null);
        setOnSuccessCallback(null);
        setIsOpen(false);
    };

    // =======================================================
    // Provider render
    // =======================================================
    return (
        <RicorrenzeContext.Provider
            value={{
                ricorrenze,
                loading,
                error,
                refresh: loadRicorrenze,
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

// ===========================================================
// Hook custom per usare il context
// ===========================================================
export function useRicorrenze() {
    const context = useContext(RicorrenzeContext);
    if (!context) throw new Error("useRicorrenze deve essere usato dentro <RicorrenzeProvider>");
    return context;
}
// ===========================================================
