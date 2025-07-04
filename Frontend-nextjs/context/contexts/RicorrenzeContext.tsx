"use client";

// ============================
// RicorrenzeContext.tsx — Context globale ricorrenze + modale create/edit
// ============================

import { createContext, useContext, useState, useEffect } from "react";
import NewRicorrenzaModal from "@/app/(protected)/newRicorrenza/NewRicorrenzaModal";
import { Ricorrenza, RicorrenzaBase } from "@/types/types/ricorrenza";
import { fetchRicorrenze, createRicorrenza, updateRicorrenza } from "@/lib/api/ricorrenzeApi";
import { unwrapApiArray } from "@/utils/unwrapApiArray";
import { normalizeRicorrenza } from "@/utils/normalizeRicorrenza";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// --------------------
// Tipi del context
// --------------------
type RicorrenzeContextType = {
    ricorrenze: Ricorrenza[];
    loading: boolean;
    refresh: () => void;
    openModal: (ricorrenzaToEdit?: Ricorrenza | null, onSuccess?: (ricorrenzaSalvata: Ricorrenza) => void) => void;
    closeModal: () => void;
    isOpen: boolean;
};

// --------------------
// Export context
// --------------------
export const RicorrenzeContext = createContext<RicorrenzeContextType | undefined>(undefined);

// --------------------
// Provider
// --------------------
export function RicorrenzeProvider({ children }: { children: React.ReactNode }) {
    const [ricorrenze, setRicorrenze] = useState<Ricorrenza[]>([]);
    const [loading, setLoading] = useState(false);

    // --- Stato per modale unica create/edit ---
    const [isOpen, setIsOpen] = useState(false);
    const [ricorrenzaToEdit, setRicorrenzaToEdit] = useState<Ricorrenza | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((r: Ricorrenza) => void) | null>(null);

    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // --- Carica ricorrenze dal backend ---
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

    // --- Effetto su token ---
    useEffect(() => {
        if (token) loadRicorrenze();
    }, [token]);

    // --- Apertura modale create/edit ---
    const openModal = (ricorrenza?: Ricorrenza | null, onSuccess?: (r: Ricorrenza) => void) => {
        setRicorrenzaToEdit(ricorrenza || null);
        setOnSuccessCallback(() => onSuccess || null);
        setIsOpen(true);
    };

    // --- Chiusura modale ---
    const closeModal = () => {
        setIsOpen(false);
        setRicorrenzaToEdit(null);
        setOnSuccessCallback(null);
    };

    // --- Create Ricorrenza ---
    const handleCreate = async (data: RicorrenzaBase) => {
        if (!token) {
            toast.error("Utente non autenticato");
            return;
        }
        try {
            const nuova = await createRicorrenza(token, data);
            toast.success("Ricorrenza creata!");
            await loadRicorrenze();
            onSuccessCallback?.(nuova); // <--- Passa la nuova ricorrenza
            closeModal();
        } catch (e) {
            toast.error("Errore creazione ricorrenza");
        }
    };

    // --- Edit Ricorrenza ---
    const handleUpdate = async (data: RicorrenzaBase) => {
        if (!token || !ricorrenzaToEdit) return;
        try {
            const aggiornata = await updateRicorrenza(token, ricorrenzaToEdit.id, data);
            toast.success("Ricorrenza aggiornata!");
            await loadRicorrenze();
            onSuccessCallback?.(aggiornata); // <--- Passa la ricorrenza aggiornata
            closeModal();
        } catch (e) {
            toast.error("Errore aggiornamento ricorrenza");
        }
    };

    // --- Render provider ---
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
            {/* --- Modale unica per creazione/modifica --- */}
            <NewRicorrenzaModal
                open={isOpen}
                onClose={closeModal}
                ricorrenzaToEdit={ricorrenzaToEdit}
                onSave={ricorrenzaToEdit ? handleUpdate : handleCreate}
            />
        </RicorrenzeContext.Provider>
    );
}

// --------------------
// Hook custom per usare il context
// --------------------
export function useRicorrenze() {
    const context = useContext(RicorrenzeContext);
    if (!context) throw new Error("useRicorrenze deve essere usato dentro <RicorrenzeProvider>");
    return context;
}

// =======================================================
// END RicorrenzeContext.tsx
// =======================================================
