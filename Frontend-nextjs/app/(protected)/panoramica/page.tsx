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

    // ───────────── HANDLER: Modifica ─────────────
    async function handleEdit(t: Transaction) {
        const updated = await update(t);
        if (updated) {
            setTransactions((trs) => trs.map((tx) => (tx.id === updated.id ? updated : tx)));
            setSelected(updated);
        } else {
            alert("Errore nel salvataggio");
        }
    }

    // ───────────── HANDLER: Cancella ─────────────
    async function handleDelete(t: Transaction) {
        if (confirm("Vuoi davvero eliminare questa transazione?")) {
            const ok = await remove(t);
            if (ok) {
                setTransactions((trs) => trs.filter((tx) => tx.id !== t.id));
                setSelected(null);
            } else {
                alert("Errore nella cancellazione");
            }
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
                <TransactionsList transactions={transactions} onSelect={setSelected} categories={categories} />
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
