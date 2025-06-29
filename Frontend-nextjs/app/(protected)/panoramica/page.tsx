// app/(protected)/panoramica/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTransactions } from "@/hooks/useTransactions"; // GET + refetch
import { useTransactionsApi } from "@/hooks/useTransactionsApi"; // CUD
import { useCategories } from "@/hooks/useCategories"; // GET categorie
import { useNewTransaction } from "@/context/contexts/NewTransactionContext";

import TransactionsList from "./components/TransactionsList";
import CalendarGrid from "./components/CalendarGrid";
import CalendarGridSkeleton from "./components/skeleton/CalendarGridSkeleton";
import TransactionsListSkeleton from "./components/skeleton/TransactionsListSkeleton";
import TransactionDetailModal from "./components/modal/TransactionDetailModal";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import { useSelection } from "@/context/contexts/SelectionContext";
import SelectionToolbar from "./components/SelectionToolbar";

import { Transaction } from "@/types";

export default function PanoramicaPage() {
    // ───────────── SESSIONE UTENTE ─────────────
    const { data: session } = useSession();
    const token = session?.accessToken;

    // ───────────── NUOVA TRANS. (context) ─────────────
    const { open } = useNewTransaction();

    // ───────────── DATI TRANSAZIONI (hook GET) ─────────────
    const {
        transactions: fetchedTransactions,
        loading,
        error,
        // refetch, // ← se vuoi rifare il GET dopo il create, scommenta
    } = useTransactions(token);

    // ───────────── STATO LOCALE: Transazioni ─────────────
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    useEffect(() => {
        if (fetchedTransactions) setTransactions(fetchedTransactions);
    }, [fetchedTransactions]);

    // ───────────── DATI CATEGORIE ─────────────
    const { categories, loading: catLoading, error: catError } = useCategories(token);

    // ───────────── MUTAZIONI TRANSAZIONI ─────────────
    const { update, remove, status: cudStatus, error: apiError } = useTransactionsApi(token);

    // ───────────── STATO: Transazione selezionata ─────────────
    const [selected, setSelected] = useState<Transaction | null>(null);

    // ───────────── HANDLER: Modifica ───────────── Pattern ottimistico
    async function handleEdit(t: Transaction) {
        // 1. Salva lo stato precedente
        const prevTransactions = [...transactions];

        // 2. Aggiorna SUBITO la lista locale (optimistic update)
        setTransactions((trs) => trs.map((tx) => (tx.id === t.id ? t : tx)));
        setSelected(t);

        try {
            // 3. Manda la richiesta di update
            const updated = await update(t);
            if (!updated) throw new Error();

            // 4. (opzionale) Refetch per massima coerenza
            // refetch?.();
        } catch {
            // 5. Se l’API fallisce, rollback e avvisa l’utente
            alert("Errore nel salvataggio, annullo la modifica.");
            setTransactions(prevTransactions);
            setSelected(prevTransactions.find((tx) => tx.id === t.id) || null);
        }
    }

    // ───────────── HANDLER: Cancella ───────────── Pattern ottimistico
    async function handleDelete(t: Transaction) {
        // 1. Salva la lista precedente
        const prevTransactions = [...transactions];
        // 2. Aggiorna subito la lista locale (optimistic)
        setTransactions((trs) => trs.filter((tx) => tx.id !== t.id));
        setSelected(null);

        try {
            // 3. Lancia la delete in background
            const ok = await remove(t);
            if (!ok) throw new Error();
            // 4. (opzionale) refetch per sincronizzare lo stato dopo delete
            // refetch?.();
        } catch {
            // 5. Se la delete fallisce, mostra errore e ripristina lista locale
            alert("Errore nella cancellazione");
            setTransactions(prevTransactions);
        }
    }

    // ───────────── HANDLER: Aggiunta OTTIMISTICA ─────────────
    // (chiamato dal context via open(onSuccess))
    const handleAdd = useCallback(
        (newTx: Transaction) => {
            // ricostruisci il campo `category` in frontend
            const fullCategory = categories.find((c) => c.id === newTx.category_id);
            const completeTx = { ...newTx, category: fullCategory };
            // —— Ottimistic update: aggiungi subito in testa:
            setTransactions((prev) => [completeTx, ...prev]);

            // —— OPPURE, per rifare sempre la GET completa:
            // refetch?.();
        },
        [categories /*, refetch*/]
    );

    // Handler per click sulla riga
    function handleRowClick(tx: Transaction) {
        setSelected(tx); // apre la modale con i dettagli
    }
    const { isSelectionMode, setIsSelectionMode, setSelectedIds } = useSelection();

    async function handleDeleteSelectedTransactions(ids: number[]) {
        // Puoi chiamare la tua API di delete massiva qui (es: Promise.all)
        for (const id of ids) {
            const t = transactions.find((tx) => tx.id === id);
            if (t) await remove(t);
        }
        setTransactions((prev) => prev.filter((tx) => !ids.includes(tx.id)));
    }

    // ============================== //
    //            RENDER              //
    // ============================== //
    return (
        <div className="space-y-6">
            {/* ─── HEADER ─── */}
            <div className="flex items-center justify-between rounded-2xl bg-bg-elevate px-5 py-4 shadow-md border border-border">
                <h1 className="text-2xl font-bold">📅 Riepilogo con Calendario</h1>
                {/* passo handleAdd come callback onSuccess */}
                <NewTransactionButton onSuccess={handleAdd} />
            </div>

            {/* ─── CALENDARIO ─── */}
            {loading ? <CalendarGridSkeleton /> : <CalendarGrid transactions={transactions} />}

            {/* ─── LISTA TRANSAZIONI ─── */}
            {loading ? (
                <TransactionsListSkeleton />
            ) : (
                <>
                    <SelectionToolbar onDeleteSelected={handleDeleteSelectedTransactions} />

                    <TransactionsList
                        transactions={transactions}
                        onSelect={setSelected}
                        categories={categories}
                        selectedId={selected?.id}
                    />
                </>
            )}

            {/* ─── ERRORI API ─── */}
            {(error || apiError) && <div className="p-4 text-danger text-sm">{error || apiError}</div>}

            {/* ─── MODALE DETTAGLIO ─── */}
            {selected && (
                <TransactionDetailModal
                    transaction={selected}
                    onClose={() => setSelected(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    categories={categories}
                />
            )}

            {/* ─── CARICAMENTO CATEGORIE / ERRORI ─── */}
            {(catLoading || catError) && (
                <div className="p-2 text-sm">
                    {catLoading ? "Categorie in caricamento..." : <span className="text-danger">{catError}</span>}
                </div>
            )}
        </div>
    );
}
