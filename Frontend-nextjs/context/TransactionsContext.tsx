"use client";

// ╔══════════════════════════════════════════════════╗
// ║ TransactionsContext — CRUD + Ottimistico + Undo ║
// ╚══════════════════════════════════════════════════╝

import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import NewTransactionModal from "@/app/(protected)/newTransaction/NewTransactionModal";
import { Transaction, TransactionBase } from "@/types";
import {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    softMoveTransaction,
} from "@/lib/api/transactionsApi";

// ── helpers condivisi ────────────────────────────────
import { parseYMD, detectAmountsAreCents, makeAmountOf, typeOf } from "@/lib/finance";

// ======================
// Tipi del context
// ======================
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

// ======================
// Context base
// ======================
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// ======================
// Provider
// ======================
export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    // ─── Stato ─────────────────────────────────────────
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Modale ────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [defaultDate, setDefaultDate] = useState<string | null>(null);
    const [defaultType, setDefaultType] = useState<"entrata" | "spesa" | null>(null);

    // ─── Auth ──────────────────────────────────────────
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    // ─── Sort coerente (usa parseYMD) ──────────────────
    const sortByDateDesc = useCallback(
        (list: Transaction[]) => [...list].sort((a, b) => (parseYMD(a.date) < parseYMD(b.date) ? 1 : -1)),
        []
    );

    // ==================================================
    // FETCH ALL (memoized + in-flight guard + abort)
    // ==================================================
    const inFlightRef = useRef(false);
    const abortRef = useRef<AbortController | null>(null);

    const fetchAll = useCallback(async () => {
        if (!token || inFlightRef.current) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        inFlightRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const data = await fetchTransactions(token, controller.signal);
            setTransactions(sortByDateDesc(data));
        } catch (e: any) {
            if (e?.name !== "AbortError") {
                const msg = e?.message || "Errore caricamento transazioni";
                setError(msg);
                toast.error(msg);
            }
        } finally {
            setLoading(false);
            inFlightRef.current = false;
        }
    }, [token, sortByDateDesc]);

    useEffect(() => () => abortRef.current?.abort(), []);
    useEffect(() => {
        if (token) fetchAll();
    }, [token, fetchAll]);

    // ==================================================
    // Importi normalizzati (stessa euristica della tabella)
    // ==================================================
    const amountsAreCents = useMemo(() => detectAmountsAreCents(transactions), [transactions]);
    const amountOf = useMemo(() => makeAmountOf(amountsAreCents), [amountsAreCents]);

    // ==================================================
    // SALDI derivati (allineati alla tabella)
    // ==================================================
    const monthBalance = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();

        return transactions
            .filter((t) => {
                const d = parseYMD(t.date);
                return d.getFullYear() === y && d.getMonth() === m;
            })
            .reduce((sum, t) => {
                const amt = amountOf(t);
                const tt = typeOf(t);
                return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
            }, 0);
    }, [transactions, amountOf]);

    const yearBalance = useMemo(() => {
        const y = new Date().getFullYear();

        return transactions
            .filter((t) => parseYMD(t.date).getFullYear() === y)
            .reduce((sum, t) => {
                const amt = amountOf(t);
                const tt = typeOf(t);
                return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
            }, 0);
    }, [transactions, amountOf]);

    const weekBalance = useMemo(() => {
        const now = new Date();
        const first = new Date(now);
        const day = now.getDay() || 7; // Domenica=7
        first.setDate(now.getDate() - day + 1);
        first.setHours(0, 0, 0, 0);

        const last = new Date(first);
        last.setDate(first.getDate() + 6);
        last.setHours(23, 59, 59, 999);

        return transactions
            .filter((t) => {
                const d = parseYMD(t.date);
                return d >= first && d <= last;
            })
            .reduce((sum, t) => {
                const amt = amountOf(t);
                const tt = typeOf(t);
                return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
            }, 0);
    }, [transactions, amountOf]);

    const totalBalance = useMemo(
        () =>
            transactions.reduce((sum, t) => {
                const amt = amountOf(t);
                const tt = typeOf(t);
                return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
            }, 0),
        [transactions, amountOf]
    );

    // ==================================================
    // CREATE / UPDATE / DELETE / MOVE (immutato)
    // ==================================================
    const create = useCallback(
        async (data: TransactionBase) => {
            if (!token) return;
            setLoading(true);

            const prev = transactions;
            const tempId = Date.now() * -1;
            const optimisticTx: Transaction = { id: tempId, ...data } as Transaction;

            setTransactions((curr) => sortByDateDesc([...curr, optimisticTx]));

            try {
                const saved = await createTransaction(token, data, data.type);
                setTransactions((curr) => sortByDateDesc(curr.map((t) => (t.id === tempId ? saved : t))));
                toast.success("Transazione creata!");
                closeModal();
            } catch (e: any) {
                setTransactions(prev);
                await fetchAll();
                toast.error(e?.message || "Errore creazione transazione");
            } finally {
                setLoading(false);
            }
        },
        [token, transactions, sortByDateDesc, fetchAll]
    );

    const update = useCallback(
        async (id: number, data: TransactionBase) => {
            if (!token) return;
            setLoading(true);

            const prev = transactions;
            const target = transactions.find((t) => t.id === id);
            if (!target) {
                setLoading(false);
                return;
            }

            const optimisticTx: Transaction = { ...target, ...data, id } as Transaction;
            setTransactions((curr) => sortByDateDesc(curr.map((t) => (t.id === id ? optimisticTx : t))));

            try {
                const saved = await updateTransaction(token, { ...data, id } as unknown as Transaction);
                setTransactions((curr) => sortByDateDesc(curr.map((t) => (t.id === id ? saved : t))));
                toast.success("Transazione aggiornata!");
                closeModal();
            } catch (e: any) {
                setTransactions(prev);
                await fetchAll();
                toast.error(e?.message || "Errore aggiornamento transazione");
            } finally {
                setLoading(false);
            }
        },
        [token, transactions, sortByDateDesc, fetchAll]
    );

    const remove = useCallback(
        async (id: number) => {
            if (!token) return;
            setLoading(true);

            const prev = transactions;
            const tx = transactions.find((t) => t.id === id);
            if (!tx) {
                setLoading(false);
                return;
            }

            setTransactions((curr) => curr.filter((t) => t.id !== id));

            try {
                await deleteTransaction(token, tx);
                toast.success("Transazione eliminata!", {
                    description: (
                        <div>
                            <span className="font-semibold">{tx.description}</span> rimossa.
                            <br />
                            <span className="text-sm text-zinc-500">
                                Puoi annullare questa operazione con il bottone…
                            </span>
                        </div>
                    ),
                    action: {
                        label: "Ripristina",
                        onClick: async () => {
                            if (!token) return;
                            setLoading(true);
                            try {
                                const { id: _omit, ...txBase } = tx as any;
                                const restored = await createTransaction(token, txBase, tx.type);
                                setTransactions((curr) => sortByDateDesc([restored, ...curr]));
                                toast.success("Eliminazione annullata!");
                            } catch {
                                await fetchAll();
                                toast.error("Errore durante l'annullamento.");
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                });
            } catch (e: any) {
                setTransactions(prev);
                await fetchAll();
                toast.error(e?.message || "Errore eliminazione transazione");
            } finally {
                setLoading(false);
            }
        },
        [token, transactions, sortByDateDesc, fetchAll]
    );

    const softMove = useCallback(
        async (original: Transaction, formData: Transaction, newType: "entrata" | "spesa") => {
            if (!token) return;
            setLoading(true);

            const prev = transactions;
            setTransactions((curr) => curr.filter((t) => t.id !== original.id));

            try {
                const created = await softMoveTransaction(token, original, formData, newType);
                setTransactions((curr) => sortByDateDesc([created, ...curr]));
                toast.success("Transazione spostata!");
                closeModal();
            } catch (e: any) {
                setTransactions(prev);
                await fetchAll();
                toast.error(e?.message || "Errore spostamento transazione");
            } finally {
                setLoading(false);
            }
        },
        [token, transactions, sortByDateDesc, fetchAll]
    );

    // ─── Modale ─────────────────────────────────────────
    const openModal = useCallback((tx?: Transaction | null, date?: string, type?: "entrata" | "spesa") => {
        setTransactionToEdit(tx ?? null);
        setDefaultDate(date ?? null);
        setDefaultType(type ?? null);
        setIsOpen(true);
    }, []);
    const closeModal = useCallback(() => {
        setTransactionToEdit(null);
        setDefaultDate(null);
        setDefaultType(null);
        setIsOpen(false);
    }, []);

    // ======================
    // Render
    // ======================
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

// ======================
// Hook custom
// ======================
export function useTransactions() {
    const ctx = useContext(TransactionsContext);
    if (!ctx) throw new Error("useTransactions deve essere usato dentro <TransactionsProvider>");
    return ctx;
}

// ──────────────────────────────────────────────────────
// Descrizione file:
// Provider + hook. Usa helpers condivisi da `lib/finance`
// così i saldi coincidono con la tabella e non duplico
// logica di normalizzazione/importi/date.
// ──────────────────────────────────────────────────────
