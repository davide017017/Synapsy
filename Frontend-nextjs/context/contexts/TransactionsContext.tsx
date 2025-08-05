"use client";

// ╔══════════════════════════════════════════════════╗
// ║ TransactionsContext — CRUD + Undo/Redo Sonner   ║
// ╚══════════════════════════════════════════════════╝

import { createContext, useContext, useState, useEffect, useMemo } from "react";
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

// ==================================================
// Tipi context
// ==================================================
type TransactionsContextType = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
    create: (data: TransactionBase) => Promise<void>;
    update: (id: number, data: TransactionBase) => Promise<void>;
    remove: (id: number) => Promise<void>;
    softMove: (original: Transaction, formData: Transaction, newType: "entrata" | "spesa") => Promise<void>;
    isOpen: boolean;
    transactionToEdit: Transaction | null;
    openModal: (txToEdit?: Transaction | null, defaultDate?: string, defaultType?: "entrata" | "spesa") => void;
    closeModal: () => void;
    defaultDate: string | null;
    defaultType: "entrata" | "spesa" | null;
    monthBalance: number;
    yearBalance: number;
    weekBalance: number;
    totalBalance: number;
};

// ==================================================
// Context base
// ==================================================
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// ==================================================
// Provider principale
// ==================================================
export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modale
    const [isOpen, setIsOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [defaultDate, setDefaultDate] = useState<string | null>(null);
    const [defaultType, setDefaultType] = useState<"entrata" | "spesa" | null>(null);

    // Per undo temporaneo
    const [lastDeleted, setLastDeleted] = useState<Transaction | null>(null);

    // Auth
    const { data: session } = useSession();
    const token = session?.accessToken;

    // ==================================================
    // Carica tutte le transazioni all'avvio/autenticazione
    // ==================================================
    useEffect(() => {
        if (token) {
            fetchAll();
        }
    }, [token]);

    // ==================================================
    // Saldi mese/anno/settimana/totale
    // ==================================================
    const monthBalance = useMemo(() => {
        const now = new Date();
        return transactions
            .filter((t) => {
                const d = new Date(t.date);
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
            })
            .reduce((sum, t) => sum + (t.type === "entrata" ? t.amount : -t.amount), 0);
    }, [transactions]);

    const yearBalance = useMemo(() => {
        const now = new Date();
        return transactions
            .filter((t) => new Date(t.date).getFullYear() === now.getFullYear())
            .reduce((sum, t) => sum + (t.type === "entrata" ? t.amount : -t.amount), 0);
    }, [transactions]);

    // Settimana corrente (da lunedì a domenica)
    const weekBalance = useMemo(() => {
        const now = new Date();
        // Calcola il lunedì della settimana corrente
        const firstDayOfWeek = new Date(now);
        const day = now.getDay() || 7; // Domenica=7
        firstDayOfWeek.setDate(now.getDate() - day + 1);
        firstDayOfWeek.setHours(0, 0, 0, 0);
        // Calcola la domenica della settimana corrente
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);

        return transactions
            .filter((t) => {
                const d = new Date(t.date);
                return d >= firstDayOfWeek && d <= lastDayOfWeek;
            })
            .reduce((sum, t) => sum + (t.type === "entrata" ? t.amount : -t.amount), 0);
    }, [transactions]);

    // Saldo totale (tutte le transazioni)
    const totalBalance = useMemo(() => {
        return transactions.reduce((sum, t) => sum + (t.type === "entrata" ? t.amount : -t.amount), 0);
    }, [transactions]);

    // ==================================================
    // Fetch ALL
    // ==================================================
    const fetchAll = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTransactions(token);
            setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (e: any) {
            setError(e.message || "Errore caricamento transazioni");
            toast.error(e.message || "Errore caricamento transazioni");
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // CREATE
    // ==================================================
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

    // ==================================================
    // UPDATE
    // ==================================================
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

    // ==================================================
    // REMOVE + Undo (Sonner)
    // ==================================================
    const remove = async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            const tx = transactions.find((t) => t.id === id);
            if (!tx) return;

            // 1. Cancella
            await deleteTransaction(token, tx);
            setLastDeleted(tx); // Salva per eventuale undo
            await fetchAll();

            // 2. Toast con undo
            toast.success("Transazione eliminata!", {
                description: (
                    <div>
                        <span className="font-semibold">{tx.description}</span> rimossa.
                        <br />
                        <span className="text-sm text-zinc-500">
                            Puoi annullare questa operazione con il bottone ...
                        </span>
                    </div>
                ),
                action: {
                    label: "Ripristina",
                    onClick: async () => {
                        if (!token || !tx) return;
                        setLoading(true);
                        try {
                            // Rimuovi l'id dal payload per ricreare la transazione
                            const { id, ...txBase } = tx;
                            await createTransaction(token, txBase, tx.type);
                            await fetchAll();
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
            toast.error(e.message || "Errore eliminazione transazione");
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // SOFT MOVE
    // ==================================================
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

    // ==================================================
    // Gestione Modale
    // ==================================================
    const openModal = (tx?: Transaction | null, date?: string, type?: "entrata" | "spesa") => {
        setTransactionToEdit(tx || null);
        setDefaultDate(date ?? null);
        setDefaultType(type ?? null);
        setIsOpen(true);
    };
    const closeModal = () => {
        setTransactionToEdit(null);
        setDefaultDate(null);
        setDefaultType(null);
        setIsOpen(false);
    };

    // ==================================================
    // Provider render
    // ==================================================
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
                defaultDate,
                defaultType,
                openModal,
                closeModal,
                monthBalance,
                yearBalance,
                weekBalance,
                totalBalance,
            }}
        >
            {children}
            <NewTransactionModal defaultDate={defaultDate ?? undefined} defaultType={defaultType ?? undefined} />
        </TransactionsContext.Provider>
    );
}

// ==================================================
// Hook custom
// ==================================================
export function useTransactions() {
    const context = useContext(TransactionsContext);
    if (!context) throw new Error("useTransactions deve essere usato dentro <TransactionsProvider>");
    return context;
}
// ==================================================
