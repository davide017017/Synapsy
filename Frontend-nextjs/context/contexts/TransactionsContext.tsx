"use client";

// ╔══════════════════════════════════════════════════╗
// ║ TransactionsContext — CRUD semplice/sincrono    ║
// ╚══════════════════════════════════════════════════╝

import { createContext, useContext, useState } from "react";
import { Transaction, TransactionBase } from "@/types";
import {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    softMoveTransaction,
} from "@/lib/api/transactionsApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NewTransactionModal from "@/app/(protected)/newTransaction/NewTransactionModal";

// ==================
// Tipi context
// ==================
type TransactionsContextType = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
    // CRUD
    create: (data: TransactionBase) => Promise<void>;
    update: (id: number, data: TransactionBase) => Promise<void>;
    remove: (id: number) => Promise<void>;
    softMove: (original: Transaction, formData: Transaction, newType: "entrata" | "spesa") => Promise<void>;
    // Modale
    isOpen: boolean;
    transactionToEdit: Transaction | null;
    openModal: (txToEdit?: Transaction | null) => void;
    closeModal: () => void;
};

// ==================
// Context base
// ==================
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// ==================
// Provider principale
// ==================
export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modale
    const [isOpen, setIsOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

    // Auth
    const { data: session } = useSession();
    const token = session?.accessToken;

    // =============== Fetch ALL ==================
    const fetchAll = async () => {
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

    // =============== CREATE =====================
    const create = async (data: TransactionBase) => {
        if (!token) return;
        setLoading(true);
        try {
            await createTransaction(token, data, data.type);
            await fetchAll();
            toast.success("Transazione creata!");
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore creazione transazione");
        } finally {
            setLoading(false);
        }
    };

    // =============== UPDATE =====================
    const update = async (id: number, data: TransactionBase) => {
        if (!token) return;
        setLoading(true);
        try {
            await updateTransaction(token, { ...data, id });
            await fetchAll();
            toast.success("Transazione aggiornata!");
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore aggiornamento transazione");
        } finally {
            setLoading(false);
        }
    };

    // =============== REMOVE =====================
    const remove = async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            const tx = transactions.find((t) => t.id === id);
            if (!tx) return;
            await deleteTransaction(token, tx);
            await fetchAll();
            toast.success("Transazione eliminata!");
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione transazione");
        } finally {
            setLoading(false);
        }
    };

    // =============== SOFT MOVE ==================
    const softMove = async (original: Transaction, formData: Transaction, newType: "entrata" | "spesa") => {
        if (!token) return;
        setLoading(true);
        try {
            await softMoveTransaction(token, original, formData, newType);
            await fetchAll();
            toast.success("Transazione spostata!");
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore spostamento transazione");
        } finally {
            setLoading(false);
        }
    };

    // =============== Modale =====================
    const openModal = (tx?: Transaction | null) => {
        setTransactionToEdit(tx || null);
        setIsOpen(true);
    };
    const closeModal = () => {
        setTransactionToEdit(null);
        setIsOpen(false);
    };

    // =============== Provider render =============
    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                loading,
                error,
                fetchAll,
                create,
                update,
                remove,
                softMove,
                isOpen,
                transactionToEdit,
                openModal,
                closeModal,
            }}
        >
            {children}
            <NewTransactionModal />
        </TransactionsContext.Provider>
    );
}

// ==================
// Hook custom
// ==================
export function useTransactions() {
    const context = useContext(TransactionsContext);
    if (!context) throw new Error("useTransactions deve essere usato dentro <TransactionsProvider>");
    return context;
}
// ==================
