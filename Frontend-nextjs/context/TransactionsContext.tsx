"use client";

/* ╔══════════════════════════════════════════════════╗
 * ║ TransactionsContext — CRUD + Ottimistico + Undo ║
 * ╚══════════════════════════════════════════════════╝ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
  softMove: (
    original: Transaction,
    formData: Transaction,
    newType: "entrata" | "spesa"
  ) => Promise<void>;

  isOpen: boolean;
  transactionToEdit: Transaction | null;
  openModal: (
    txToEdit?: Transaction | null,
    defaultDate?: string,
    defaultType?: "entrata" | "spesa"
  ) => void;
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
const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

// ======================
// Provider
// ======================
export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  // ---- Stato base ----
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Modale ----
  const [isOpen, setIsOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);
  const [defaultType, setDefaultType] = useState<"entrata" | "spesa" | null>(null);

  // ---- Auth ----
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  // ---- Util: sort per data desc ----
  const sortByDateDesc = useCallback(
    (list: Transaction[]) =>
      [...list].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  // ==================================================
  // FETCH ALL (memoized + in-flight guard + abort)
  // ==================================================
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAll = useCallback(async () => {
    if (!token || inFlightRef.current) return;

    // Annulla eventuale richiesta precedente
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

  // cleanup abort su unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Carica dati quando c'è il token
  useEffect(() => {
    if (token) fetchAll();
  }, [token, fetchAll]);

  // ==================================================
  // SALDI derivati
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

  const weekBalance = useMemo(() => {
    const now = new Date();

    // lunedì corrente
    const firstDayOfWeek = new Date(now);
    const day = now.getDay() || 7; // Domenica=7
    firstDayOfWeek.setDate(now.getDate() - day + 1);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    // domenica corrente
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

  const totalBalance = useMemo(
    () => transactions.reduce((sum, t) => sum + (t.type === "entrata" ? t.amount : -t.amount), 0),
    [transactions]
  );

  // ==================================================
  // CREATE (ottimistico con id temporaneo)
  // ==================================================
  const create = useCallback(
    async (data: TransactionBase) => {
      if (!token) return;
      setLoading(true);

      const prev = transactions;
      const tempId = Date.now() * -1;
      const optimisticTx: Transaction = { id: tempId, ...data } as Transaction;

      // Inserisci subito
      setTransactions((curr) => sortByDateDesc([...curr, optimisticTx]));

      try {
        const saved = await createTransaction(token, data, data.type);
        // Rimpiazza l'id temporaneo con l’oggetto reale
        setTransactions((curr) =>
          sortByDateDesc(curr.map((t) => (t.id === tempId ? saved : t)))
        );
        toast.success("Transazione creata!");
        closeModal();
      } catch (e: any) {
        // rollback e fallback
        setTransactions(prev);
        await fetchAll();
        toast.error(e?.message || "Errore creazione transazione");
      } finally {
        setLoading(false);
      }
    },
    [token, transactions, sortByDateDesc, fetchAll]
  );

  // ==================================================
  // UPDATE (ottimistico)
  // ==================================================
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

      // Applica subito le modifiche
      const optimisticTx: Transaction = { ...target, ...data, id } as Transaction;
      setTransactions((curr) =>
        sortByDateDesc(curr.map((t) => (t.id === id ? optimisticTx : t)))
      );

      try {
        const saved = await updateTransaction(token, { ...data, id } as unknown as Transaction);
        setTransactions((curr) =>
          sortByDateDesc(curr.map((t) => (t.id === id ? saved : t)))
        );
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

  // ==================================================
  // DELETE (ottimistico + Undo)
  // ==================================================
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

      // Rimuovi subito
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
                // ricrea lato server e reinserisci localmente
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
        // rollback e fallback
        setTransactions(prev);
        await fetchAll();
        toast.error(e?.message || "Errore eliminazione transazione");
      } finally {
        setLoading(false);
      }
    },
    [token, transactions, sortByDateDesc, fetchAll]
  );

  // ==================================================
  // SOFT MOVE (ottimistico semplice)
  // ==================================================
  const softMove = useCallback(
    async (original: Transaction, formData: Transaction, newType: "entrata" | "spesa") => {
      if (!token) return;
      setLoading(true);

      const prev = transactions;

      // rimuovi subito l’originale
      setTransactions((curr) => curr.filter((t) => t.id !== original.id));

      try {
        const created = await softMoveTransaction(token, original, formData, newType);
        // inserisci la nuova transazione ritornata dall’API
        setTransactions((curr) => sortByDateDesc([created, ...curr]));
        toast.success("Transazione spostata!");
        closeModal();
      } catch (e: any) {
        // rollback e fallback
        setTransactions(prev);
        await fetchAll();
        toast.error(e?.message || "Errore spostamento transazione");
      } finally {
        setLoading(false);
      }
    },
    [token, transactions, sortByDateDesc, fetchAll]
  );

  // ==================================================
  // Gestione modale
  // ==================================================
  const openModal = useCallback(
    (tx?: Transaction | null, date?: string, type?: "entrata" | "spesa") => {
      setTransactionToEdit(tx ?? null);
      setDefaultDate(date ?? null);
      setDefaultType(type ?? null);
      setIsOpen(true);
    },
    []
  );

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
      <NewTransactionModal
        defaultDate={defaultDate ?? undefined}
        defaultType={defaultType ?? undefined}
      />
    </TransactionsContext.Provider>
  );
}

// ======================
// Hook custom
// ======================
export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx)
    throw new Error("useTransactions deve essere usato dentro <TransactionsProvider>");
  return ctx;
}
