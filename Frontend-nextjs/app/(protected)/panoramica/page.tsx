// app/(protected)/panoramica/page.tsx
"use client";

// ============================
// PanoramicaPage.tsx — Uniformata, tutto da context
// ============================

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
    // --- Context transazioni ---
    const {
        transactions,
        loading,
        error,
        update,
        remove,
        openModal, // modale globale (per edit/crea)
    } = useTransactions();

    // --- Context categorie ---
    const { categories, loading: catLoading, error: catError } = useCategories();

    // --- Stato: transazione selezionata per modal dettaglio ---
    const [selected, setSelected] = useState<number | null>(null);

    // --- Selection toolbar ---
    const { isSelectionMode } = useSelection();

    // Handler: Click riga → apri dettaglio
    function handleRowClick(txId: number) {
        setSelected(txId);
    }

    // Handler: Modifica transazione da dettaglio modal
    async function handleEdit(tx: any) {
        await update(tx.id, tx);
        setSelected(null);
    }

    // Handler: Cancella transazione da dettaglio modal
    async function handleDelete(tx: any) {
        await remove(tx.id);
        setSelected(null);
    }

    // Handler: Cancellazione massiva
    async function handleDeleteSelectedTransactions(ids: number[]) {
        for (const id of ids) {
            await remove(id);
        }
    }

    // --- Ricava la transazione selezionata (per modale dettaglio) ---
    const selectedTx = transactions.find((tx) => tx.id === selected);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between rounded-2xl bg-bg-elevate px-5 py-4 shadow-md border border-border">
                <h1 className="text-2xl font-bold">📅 Riepilogo con Calendario</h1>
                {/* Callback su onSuccess, qui aggiorni eventuale lista locale */}
                <NewTransactionButton />
            </div>

            {/* CALENDARIO */}
            {loading ? <CalendarGridSkeleton /> : <CalendarGrid transactions={transactions} />}

            {/* LISTA TRANSAZIONI */}
            {loading ? (
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

            {/* ERRORI API */}
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

            {/* CARICAMENTO/ERRORI CATEGORIE */}
            {(catLoading || catError) && (
                <div className="p-2 text-sm">
                    {catLoading ? "Categorie in caricamento..." : <span className="text-danger">{catError}</span>}
                </div>
            )}
        </div>
    );
}
// Questo file rappresenta la pagina principale della panoramica, con calendario e lista transazioni.
// Utilizza i context per gestire transazioni e categorie.
// Include modale per dettaglio transazione e pulsante per aggiungere nuove transazioni.
