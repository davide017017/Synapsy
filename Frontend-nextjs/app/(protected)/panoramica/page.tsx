"use client";

// ================================================
// Pagina riepilogo calendario — CRUD sincrono
// ================================================

import { useEffect } from "react";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import CalendarGrid from "./components/CalendarGrid";
import CalendarGridSkeleton from "./components/skeleton/CalendarGridSkeleton";
import NewTransactionButton from "../newTransaction/NewTransactionButton";

export default function PanoramicaPage() {
    const { transactions, loading, fetchAll } = useTransactions();

    useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div className="space-y-6">
            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-6 shadow-md overflow-hidden animate-fade-in">
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Sostituisci con icona Lucide se vuoi */}
                    <svg
                        className="w-[180px] h-[180px] text-[hsl(var(--c-secondary))] opacity-5"
                        style={{ filter: "blur(2px)" }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" />
                    </svg>
                </div>

                {/* -------- Titolo e descrizione -------- */}
                <div className="relative z-10 text-center max-w-xl mx-auto space-y-2">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold flex justify-center items-center gap-3 text-[hsl(var(--c-primary-dark))] drop-shadow-sm">
                        {/* Sostituisci con icona a tema calendario */}
                        <span className="inline-block w-7 h-7 text-[hsl(var(--c-primary))]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-7 h-7"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                {/* Icona calendario */}
                                <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 2v4" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 2v4" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                        <span>Riepilogo con Calendario</span>
                    </h1>
                    <p className="text-sm text-[hsl(var(--c-text-secondary))]">
                        Visualizza entrate e spese giorno per giorno in modo ordinato e intuitivo.
                    </p>
                </div>

                {/* -------- Pulsante -------- */}
                <div className="relative z-10 mt-4 flex justify-center">
                    <NewTransactionButton />
                </div>
            </div>

            {loading ? <CalendarGridSkeleton /> : <CalendarGrid transactions={transactions} />}
        </div>
    );
}
