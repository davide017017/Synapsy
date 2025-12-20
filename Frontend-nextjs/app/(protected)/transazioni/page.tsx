"use client";

// ==============================================
// Pagina principale lista transazioni — CRUD sync
// ==============================================

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import { useTransactions } from "@/context/TransactionsContext";
import { useCategories } from "@/context/CategoriesContext";

import SelectionToolbar from "./components/SelectionToolbar";
import TransactionsListSkeleton from "./skeleton/TransactionsListSkeleton";
import TransactionDetailModal from "./modal/TransactionDetailModal";
import NewTransactionButton from "../newTransaction/NewTransactionButton";

import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import { Transaction } from "@/types/models/transaction";

// --------------------------------------------------
// Lazy list (migliora first render)
// --------------------------------------------------
const TransactionsList = dynamic(() => import("./components/TransactionsList"), {
    loading: () => <TransactionsListSkeleton />,
    ssr: false,
});

export default function TransazioniPage() {
    // ----------------------------
    // Context
    // ----------------------------
    const { transactions, loading, error, update, remove } = useTransactions();
    const { categories } = useCategories();

    // ----------------------------
    // UI state
    // ----------------------------
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ----------------------------
    // CRUD handlers
    // ----------------------------
    const handleEdit = async (tx: Transaction) => {
        setSelectedId(null);
        setIsLoading(true);
        await update(tx.id, tx);
        setIsLoading(false);
    };

    const handleDelete = async (tx: Transaction) => {
        setSelectedId(null);
        setIsLoading(true);
        await remove(tx.id);
        setIsLoading(false);
    };

    const handleDeleteSelectedTransactions = async (ids: number[]) => {
        setIsLoading(true);

        // Nota: semplice e leggibile (come vuoi tu).
        // Se vuoi, dopo lo rendiamo parallel con Promise.all.
        for (const id of ids) await remove(id);

        setIsLoading(false);
    };

    // ----------------------------
    // Derived
    // ----------------------------
    const selectedTx = transactions.find((tx) => tx.id === selectedId);

    return (
        <div className="space-y-5">
            {/* ===================== Header ===================== */}
            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-6 shadow-md overflow-hidden animate-fade-in">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                        className="w-[180px] h-[180px] text-[hsl(var(--c-secondary))] opacity-5"
                        style={{ filter: "blur(2px)" }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" />
                    </svg>
                </div>

                <div className="relative z-10 text-center max-w-xl mx-auto space-y-2">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold flex justify-center items-center gap-3 text-[hsl(var(--c-primary-dark))] drop-shadow-sm">
                        <span className="inline-block w-7 h-7 text-[hsl(var(--c-primary))]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-7 h-7"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                        <span>Transazioni</span>
                    </h1>

                    <p className="text-sm text-[hsl(var(--c-text-secondary))]">
                        Tieni traccia in modo ordinato delle tue entrate e spese giornaliere.
                    </p>
                </div>

                <div className="relative z-10 mt-4 flex justify-center">
                    <NewTransactionButton />
                </div>
            </div>
            {/* ===================== /Header ===================== */}

            {/* ===================== Lista ====================== */}
            {loading ? (
                <TransactionsListSkeleton />
            ) : (
                <Suspense fallback={<TransactionsListSkeleton />}>
                    <>
                        <SelectionToolbar onDeleteSelected={handleDeleteSelectedTransactions} />
                        <TransactionsList
                            transactions={transactions}
                            onSelect={(tx) => setSelectedId(tx.id)}
                            selectedId={selectedId}
                        />
                    </>
                </Suspense>
            )}
            {/* ===================== /Lista ===================== */}

            {/* ===================== Error ====================== */}
            {error && <div className="p-4 text-danger text-sm">{error}</div>}
            {/* ===================== /Error ===================== */}

            {/* =================== Modale Dettaglio ============== */}
            {selectedTx && (
                <TransactionDetailModal
                    transaction={selectedTx}
                    onClose={() => setSelectedId(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    categories={categories}
                />
            )}
            {/* =============== /Modale Dettaglio ================= */}

            {/* ============== Spinner full screen ================ */}
            {isLoading && (
                <LoadingOverlay
                    show
                    fixed
                    rounded={false}
                    message="Sto aggiornando!"
                    subMessage="Attendi un istante…"
                    icon={<Loader2 className="animate-spin" size={40} />}
                />
            )}
            {/* ============ /Spinner full screen ================= */}
        </div>
    );
}

/*
File: page.tsx
Scopo: pagina Transazioni (lista + toolbar + modale dettaglio) con CRUD via context.
Come: carica lista (dynamic), gestisce selezione, apre modale, esegue update/remove e mostra overlay di loading.
*/
