// app/(protected)/panoramica/page.tsx
"use client";

/* ╔══════════════════════════════════════════════════════════╗
 * ║   PanoramicaPage.tsx — Riepilogo con calendario e lista  ║
 * ╚══════════════════════════════════════════════════════════╝ */

import { useState } from "react";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { useSelection } from "@/context/contexts/SelectionContext";

import TransactionsList from "./components/TransactionsList";
import CalendarGrid from "./components/CalendarGrid";
import CalendarGridSkeleton from "./components/skeleton/CalendarGridSkeleton";
import TransactionsListSkeleton from "./components/skeleton/TransactionsListSkeleton";
import TransactionDetailModal from "./components/modal/TransactionDetailModal";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import SelectionToolbar from "./components/SelectionToolbar";

export default function PanoramicaPage() {
    // ─── Context transazioni ──────────────────────────────────
    const { transactions, loading, error, update, remove } = useTransactions();

    // ─── Context categorie ────────────────────────────────────
    const { categories, loading: catLoading, error: catError } = useCategories();

    // ─── Stato selezione dettaglio ────────────────────────────
    const [selected, setSelected] = useState<number | null>(null);

    // ─── Selection toolbar ────────────────────────────────────
    const { isSelectionMode } = useSelection();

    // ─── Computed: solo primo loading (quando non ho ancora dati) ─
    const initialLoading = loading && transactions.length === 0;

    // ─── Handlers ──────────────────────────────────────────────
    const handleRowClick = (txId: number) => setSelected(txId);

    const handleEdit = async (tx: any) => {
        await update(tx.id, tx);
        setSelected(null);
    };

    const handleDelete = async (tx: any) => {
        await remove(tx.id);
        setSelected(null);
    };

    const handleDeleteSelectedTransactions = async (ids: number[]) => {
        for (const id of ids) {
            await remove(id);
        }
    };

    // ─── Transazione corrente per il dettaglio ────────────────
    const selectedTx = transactions.find((tx) => tx.id === selected);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between rounded-2xl bg-bg-elevate px-5 py-4 shadow-md border border-border">
                <h1 className="text-2xl font-bold">📅 Riepilogo con Calendario</h1>
                <NewTransactionButton />
            </div>

            {/* CALENDARIO */}
            {initialLoading ? <CalendarGridSkeleton /> : <CalendarGrid transactions={transactions} />}

            {/* LISTA TRANSAZIONI */}
            {initialLoading ? (
                <TransactionsListSkeleton />
            ) : (
                <>
                    <SelectionToolbar onDeleteSelected={handleDeleteSelectedTransactions} />
                    <TransactionsList
                        transactions={transactions}
                        onSelect={(tx) => setSelected(tx.id)}
                        selectedId={selected}
                    />
                </>
            )}

            {/* ERRORI API TRANSIZIONI */}
            {error && <div className="p-4 text-danger text-sm">{error}</div>}

            {/* MODALE DETTAGLIO */}
            {selectedTx && (
                <TransactionDetailModal
                    transaction={selectedTx}
                    onClose={() => setSelected(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    categories={categories}
                />
            )}

            {/* CARICAMENTO / ERRORI CATEGORIE */}
            {(catLoading || catError) && (
                <div className="p-2 text-sm">
                    {catLoading ? "Categorie in caricamento..." : <span className="text-danger">{catError}</span>}
                </div>
            )}
        </div>
    );
}
