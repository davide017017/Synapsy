"use client";

// ==============================================
// Pagina principale lista transazioni — CRUD sync
// ==============================================

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import { useTransactions } from "@/context/TransactionsContext";

import TransactionsListSkeleton from "./skeleton/TransactionsListSkeleton";
import NewTransactionButton from "../newTransaction/NewTransactionButton";

import LoadingOverlay from "@/app/components/ui/LoadingOverlay";

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
    const { transactions, loading, error, remove, openModal, transactionToEdit } = useTransactions();

    // ----------------------------
    // UI state
    // ----------------------------
    const [isLoading, setIsLoading] = useState(false);

    // ----------------------------
    // CRUD handlers
    // ----------------------------
    const handleDeleteSelectedTransactions = async (ids: string[]) => {
        setIsLoading(true);

        for (const uid of ids) {
            const [, rawId] = uid.split("-");
            await remove(Number(rawId));
        }

        setIsLoading(false);
    };

    return (
        <div className="space-y-2 md:space-y-4">
            {/* ===================== Header ===================== */}

            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-4 md:p-6 shadow-md overflow-hidden animate-fade-in">
                {/* Background icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                        className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] text-[hsl(var(--c-secondary))] opacity-5"
                        style={{ filter: "blur(2px)" }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" />
                    </svg>
                </div>

                <div className="relative z-10 space-y-2">
                    {/* ───────── Header row (mobile compatto) ───────── */}
                    <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-2">
                        <h1 className="text-lg md:text-3xl font-serif font-bold flex items-center gap-2 text-[hsl(var(--c-primary-dark))]">
                            <span className="inline-block w-5 h-5 md:w-7 md:h-7 text-[hsl(var(--c-primary))]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-full h-full"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <rect x="2" y="6" width="20" height="12" rx="3" />
                                    <path d="M2 10h20" />
                                </svg>
                            </span>
                            <span>Transazioni</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewTransactionButton />
                        </div>
                    </div>

                    {/* ───────── Subtitle ───────── */}
                    <p className="text-xs md:text-sm text-[hsl(var(--c-text-secondary))] text-left md:text-center">
                        Tieni traccia in modo ordinato delle tue entrate e spese giornaliere.
                    </p>
                </div>
            </div>

            {/* ===================== /Header ===================== */}

            {/* ===================== Lista ====================== */}
            {loading ? (
                <TransactionsListSkeleton />
            ) : (
                <Suspense fallback={<TransactionsListSkeleton />}>
                    <>
                        <TransactionsList
                            transactions={transactions}
                            onSelect={(tx) => openModal(tx)}
                            selectedId={transactionToEdit ? `${transactionToEdit.type}-${transactionToEdit.id}` : null}
                            onDeleteSelected={handleDeleteSelectedTransactions}
                        />
                    </>
                </Suspense>
            )}
            {/* ===================== /Lista ===================== */}

            {/* ===================== Error ====================== */}
            {error && <div className="p-4 text-danger text-sm">{error}</div>}
            {/* ===================== /Error ===================== */}

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
Scopo: pagina Transazioni (lista + toolbar) con CRUD via context.
Come: carica lista (dynamic), click su riga chiama openModal(tx) per aprire la modale unificata,
      gestisce bulk delete con overlay di loading locale.
*/
