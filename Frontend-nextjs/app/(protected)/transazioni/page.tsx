"use client";

// =========================================
// Pagina principale lista transazioni — CRUD sincrono
// =========================================

import { useEffect, useState } from "react";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { useCategories } from "@/context/contexts/CategoriesContext";
// import SelectionToolbar from "../components/SelectionToolbar";

import SelectionToolbar from "./components/SelectionToolbar";
import TransactionsList from "./components/TransactionsList";
import TransactionsListSkeleton from "./skeleton/TransactionsListSkeleton";
import TransactionDetailModal from "./modal/TransactionDetailModal";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import { Transaction } from "@/types/types/transaction";

export default function TransazioniPage() {
    const { transactions, loading, error, fetchAll, update, remove } = useTransactions();
    const { categories, loading: catLoading, error: catError } = useCategories();
    const [selected, setSelected] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Carica la lista al primo mount
    useEffect(() => {
        fetchAll();
    }, []);

    // --- Handler modifica ---
    const handleEdit = async (tx: Transaction) => {
        setSelected(null); // Chiudi subito la modale!
        setIsLoading(true); // Mostra spinner
        await update(tx.id, tx); // Chiamata async (o softMove...)
        setIsLoading(false); // Nascondi spinner quando fatto
    };

    // --- Handler elimina ---
    const handleDelete = async (tx: Transaction) => {
        setSelected(null);
        setIsLoading(true);
        await remove(tx.id);
        setIsLoading(false);
    };

    // --- Handler elimina selezione multipla ---
    const handleDeleteSelectedTransactions = async (ids: number[]) => {
        for (const id of ids) {
            await remove(id);
        }
    };

    const selectedTx = transactions.find((tx) => tx.id === selected);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-bg-elevate px-5 py-4 shadow-md border border-border">
                <h1 className="text-2xl font-bold">💳 Lista Transazioni</h1>
                <NewTransactionButton />
            </div>

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

            {error && <div className="p-4 text-danger text-sm">{error}</div>}

            {selectedTx && (
                <TransactionDetailModal
                    transaction={selectedTx}
                    onClose={() => setSelected(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    categories={categories}
                />
            )}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="animate-spin rounded-full border-4 border-primary border-t-transparent w-14 h-14" />
                    <span className="text-white font-semibold text-lg mt-4">
                        Attendi un attimo…
                        <br />
                        Sto aggiornando! 🚀
                    </span>
                </div>
            )}
        </div>
    );
}
