"use client";

/* ╔══════════════════════════════════════════════════════════╗
 * ║   TransactionsContext — CRUD + lista + modale unica     ║
 * ╚══════════════════════════════════════════════════════════╝ */

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Transaction, TransactionBase } from "@/types";
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/lib/api/transactionsApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NewTransactionModal from "@/app/(protected)/newTransaction/NewTransactionModal";

// ═══════════════════════════════════════════════════════════
// Tipizzazione context
// ═══════════════════════════════════════════════════════════

type TransactionsContextType = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    refresh: () => void;

    // CRUD
    create: (data: TransactionBase, onSuccess?: () => void) => Promise<void>;
    update: (id: number, data: TransactionBase, onSuccess?: () => void) => Promise<void>;
    remove: (id: number, onSuccess?: () => void) => Promise<void>;

    // Modale globale
    isOpen: boolean;
    transactionToEdit: Transaction | null;
    openModal: (txToEdit?: Transaction | null, onSuccess?: (t: Transaction) => void) => void;
    closeModal: () => void;

    // Nuovi saldi calcolati
    monthBalance: number;
    yearBalance: number;
};

// ═══════════════════════════════════════════════════════════
// Creazione e export del context
// ═══════════════════════════════════════════════════════════

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════
// Provider — logica e stato del context
// ═══════════════════════════════════════════════════════════

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    // ─── Stato base ───
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ─── Stato modale ───
    const [isOpen, setIsOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((t: Transaction) => void) | null>(null);

    // ─── Auth token ───
    const { data: session } = useSession();
    const token = session?.accessToken;

    // ─────────────────────────────────────────────────
    // Nuovo: calcolo saldi
    // ─────────────────────────────────────────────────
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // ── Calcolo saldo del mese corrente (guardando se category esiste e type in lowercase) ──
    const monthBalance = useMemo(() => {
        return transactions.reduce((sum, tx) => {
            const d = new Date(tx.date);
            if (d.getFullYear() !== currentYear || d.getMonth() !== currentMonth) {
                return sum;
            }
            // se non ho category, salto
            if (!tx.category) return sum;
            // type è "entrata" o "spesa"
            return tx.category.type === "entrata" ? sum + tx.amount : sum - tx.amount;
        }, 0);
    }, [transactions, currentMonth, currentYear]);

    // ── Calcolo saldo dell'anno corrente ──
    const yearBalance = useMemo(() => {
        return transactions.reduce((sum, tx) => {
            const d = new Date(tx.date);
            if (d.getFullYear() !== currentYear) return sum;
            if (!tx.category) return sum;
            return tx.category.type === "entrata" ? sum + tx.amount : sum - tx.amount;
        }, 0);
    }, [transactions, currentYear]);

    // ─────────────────────────────────────────────
    // Fetch transazioni da API
    // ─────────────────────────────────────────────
    const loadTransactions = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTransactions(token);
            setTransactions(data);
        } catch (e: any) {
            setError(e.message || "Errore caricamento transazioni");
            toast.error(e.message || "Errore caricamento transazioni");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadTransactions();
    }, [token]);

    // ─────────────────────────────────────────────
    // CRUD operazioni
    // ─────────────────────────────────────────────

    const create = async (data: TransactionBase, onSuccess?: () => void) => {
        if (!token) return;
        try {
            const created = await createTransaction(token, data, data.type);
            toast.success("Transazione creata!");
            await loadTransactions();
            onSuccess?.();
            onSuccessCallback?.(created);
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore creazione transazione");
        }
    };

    const update = async (id: number, data: TransactionBase, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await updateTransaction(token, { ...data, id });
            toast.success("Transazione aggiornata!");
            await loadTransactions();
            onSuccess?.();
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore aggiornamento transazione");
        }
    };

    const remove = async (id: number, onSuccess?: () => void) => {
        if (!token) return;
        try {
            const tx = transactions.find((t) => t.id === id);
            if (!tx) {
                toast.error("Transazione non trovata in memoria");
                return;
            }
            await deleteTransaction(token, tx);
            toast.success("Transazione eliminata!");
            await loadTransactions();
            onSuccess?.();
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione transazione");
        }
    };

    // ─────────────────────────────────────────────
    // Gestione modale create/edit
    // ─────────────────────────────────────────────
    const openModal = (tx?: Transaction | null, onSuccess?: (t: Transaction) => void) => {
        setTransactionToEdit(tx || null);
        setOnSuccessCallback(() => onSuccess || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setTransactionToEdit(null);
        setIsOpen(false);
        setOnSuccessCallback(null);
    };

    // ─────────────────────────────────────────────
    // Provider render
    // ─────────────────────────────────────────────
    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                loading,
                error,
                refresh: loadTransactions,
                create,
                update,
                remove,
                isOpen,
                transactionToEdit,
                openModal,
                closeModal,
                monthBalance,
                yearBalance,
            }}
        >
            {children}
            {/* Modale globale per create/edit */}
            <NewTransactionModal />
        </TransactionsContext.Provider>
    );
}

// ═══════════════════════════════════════════════════════════
// Hook custom per usare il context
// ═══════════════════════════════════════════════════════════

export function useTransactions() {
    const context = useContext(TransactionsContext);
    if (!context) throw new Error("useTransactions deve essere usato dentro <TransactionsProvider>");
    return context;
}

// ═══════════════════════════════════════════════════════════
