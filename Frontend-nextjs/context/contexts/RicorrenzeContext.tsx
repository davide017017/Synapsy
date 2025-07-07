"use client";

/* ╔══════════════════════════════════════════════════════════╗
 * ║        RicorrenzeContext — Ricorrenze: CRUD + Modale    ║
 * ╚══════════════════════════════════════════════════════════╝ */

import { createContext, useContext, useState, useEffect } from "react";
import NewRicorrenzaModal from "@/app/(protected)/newRicorrenza/NewRicorrenzaModal";
import { Ricorrenza, RicorrenzaBase } from "@/types/types/ricorrenza";
import { fetchRicorrenze, createRicorrenza, updateRicorrenza } from "@/lib/api/ricorrenzeApi";
import { unwrapApiArray } from "@/utils/unwrapApiArray";
import { normalizeRicorrenza } from "@/utils/normalizeRicorrenza";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════
// Tipizzazione context
// ═══════════════════════════════════════════════════════════

type RicorrenzeContextType = {
    ricorrenze: Ricorrenza[];
    loading: boolean;
    refresh: () => void;

    openModal: (ricorrenzaToEdit?: Ricorrenza | null, onSuccess?: (ricorrenzaSalvata: Ricorrenza) => void) => void;
    closeModal: () => void;
    isOpen: boolean;
};

// ═══════════════════════════════════════════════════════════
// Creazione e export del context
// ═══════════════════════════════════════════════════════════

export const RicorrenzeContext = createContext<RicorrenzeContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════
// Provider — logica e stato del context
// ═══════════════════════════════════════════════════════════

export function RicorrenzeProvider({ children }: { children: React.ReactNode }) {
    // ─── State base ───
    const [ricorrenze, setRicorrenze] = useState<Ricorrenza[]>([]);
    const [loading, setLoading] = useState(false);

    // ─── State modale ───
    const [isOpen, setIsOpen] = useState(false);
    const [ricorrenzaToEdit, setRicorrenzaToEdit] = useState<Ricorrenza | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((r: Ricorrenza) => void) | null>(null);

    // ─── Auth token ───
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // ─────────────────────────────────────────────
    // Fetch ricorrenze da API
    // ─────────────────────────────────────────────
    const loadRicorrenze = async () => {
        if (!token) {
            setRicorrenze([]);
            return;
        }
        setLoading(true);
        try {
            const raw = await fetchRicorrenze(token);
            const arr = unwrapApiArray(raw);
            setRicorrenze(arr.map(normalizeRicorrenza));
        } catch (e) {
            toast.error("Errore caricamento ricorrenze");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadRicorrenze();
    }, [token]);

    // ─────────────────────────────────────────────
    // Gestione modale create/edit
    // ─────────────────────────────────────────────
    const openModal = (ricorrenza?: Ricorrenza | null, onSuccess?: (r: Ricorrenza) => void) => {
        setRicorrenzaToEdit(ricorrenza || null);
        setOnSuccessCallback(() => onSuccess || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setRicorrenzaToEdit(null);
        setOnSuccessCallback(null);
    };

    // ─────────────────────────────────────────────
    // Create Ricorrenza
    // ─────────────────────────────────────────────
    const handleCreate = async (data: RicorrenzaBase) => {
        if (!token) {
            toast.error("Utente non autenticato");
            return;
        }
        try {
            const nuova = await createRicorrenza(token, data);
            toast.success("Ricorrenza creata!");
            await loadRicorrenze();
            onSuccessCallback?.(nuova); // Callback esterna
            closeModal();
        } catch (e) {
            toast.error("Errore creazione ricorrenza");
        }
    };

    // ─────────────────────────────────────────────
    // Edit Ricorrenza
    // ─────────────────────────────────────────────
    const handleUpdate = async (data: RicorrenzaBase) => {
        if (!token || !ricorrenzaToEdit) return;
        try {
            const aggiornata = await updateRicorrenza(token, ricorrenzaToEdit.id, data);
            toast.success("Ricorrenza aggiornata!");
            await loadRicorrenze();
            onSuccessCallback?.(aggiornata);
            closeModal();
        } catch (e) {
            toast.error("Errore aggiornamento ricorrenza");
        }
    };

    // ─────────────────────────────────────────────
    // Provider render
    // ─────────────────────────────────────────────
    return (
        <RicorrenzeContext.Provider
            value={{
                ricorrenze,
                loading,
                refresh: loadRicorrenze,
                openModal,
                closeModal,
                isOpen,
            }}
        >
            {children}
            {/* Modale globale per creazione/modifica */}
            <NewRicorrenzaModal
                open={isOpen}
                onClose={closeModal}
                ricorrenzaToEdit={ricorrenzaToEdit}
                onSave={ricorrenzaToEdit ? handleUpdate : handleCreate}
            />
        </RicorrenzeContext.Provider>
    );
}

// ═══════════════════════════════════════════════════════════
// Hook custom per usare il context
// ═══════════════════════════════════════════════════════════

export function useRicorrenze() {
    const context = useContext(RicorrenzeContext);
    if (!context) throw new Error("useRicorrenze deve essere usato dentro <RicorrenzeProvider>");
    return context;
}

// ═══════════════════════════════════════════════════════════
