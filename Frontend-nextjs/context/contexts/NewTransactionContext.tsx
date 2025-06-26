"use client";

/* ╔═══════════════════════════════════════════════════════════════╗
 * ║    Context globale per apertura modale nuova transazione     ║
 * ╚═══════════════════════════════════════════════════════════════╝ */

import { createContext, useContext, useState } from "react";
import NewTransactionModal from "@/app/(protected)/newTransaction/NewTransactionModal";
import { Transaction, TransactionBase } from "@/types";
import { createTransaction } from "@/lib/api/transactionsApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ============================
// Tipo del context
// ============================
type NewTransactionContextType = {
    isOpen: boolean;
    open: (onSuccess?: (newTx: Transaction) => void) => void;
    close: () => void;
    handleSave: (data: TransactionBase) => void;
};

// ============================
// Creazione del context
// ============================
const NewTransactionContext = createContext<NewTransactionContextType | undefined>(undefined);

// ============================
// Provider del context
// ============================
export function NewTransactionProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((tx: Transaction) => void) | null>(null);
    const { data: session } = useSession();
    const token = session?.accessToken;

    const open = (onSuccess?: (tx: Transaction) => void) => {
        setOnSuccessCallback(() => onSuccess || null);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setOnSuccessCallback(null);
    };

    const handleSave = async (data: TransactionBase) => {
        if (!token) {
            toast.error("Utente non autenticato");
            return;
        }

        try {
            const created = await createTransaction(token, data, data.type);
            toast.success("Transazione salvata con successo");
            onSuccessCallback?.(created); // ⬅️ aggiorna lista esterna
            close();
        } catch (err) {
            console.error("❌ Errore salvataggio:", err);
            toast.error("Errore durante il salvataggio");
        }
    };

    return (
        <NewTransactionContext.Provider value={{ isOpen, open, close, handleSave }}>
            {children}
            <NewTransactionModal />
        </NewTransactionContext.Provider>
    );
}

// ============================
// Hook per usare il context
// ============================
export function useNewTransaction() {
    const context = useContext(NewTransactionContext);
    if (!context) throw new Error("useNewTransaction deve essere usato dentro <NewTransactionProvider>");
    return context;
}
