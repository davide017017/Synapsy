"use client";

// ================================================
// Pagina riepilogo calendario — CRUD sincrono
// ================================================

import { useState } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import CalendarGrid from "./components/CalendarGrid";
import CalendarGridSkeleton from "./components/skeleton/CalendarGridSkeleton";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import DayTransactionsModal from "./components/modal/DayTransactionsModal";
import { Transaction } from "@/types";

export default function PanoramicaPage() {
    const { transactions, loading } = useTransactions();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTx, setSelectedTx] = useState<Transaction[]>([]);

    const handleDayClick = (date: Date, tx: Transaction[]) => {
        setSelectedDate(date);
        setSelectedTx(tx);
    };

    return (
        <div className="space-y-6">
            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-4 md:p-6 shadow-md overflow-hidden animate-fade-in">
                {/* -------- Icona sfumata di sfondo -------- */}
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
                                    <rect x="3" y="4" width="18" height="16" rx="3" />
                                    <path d="M3 10h18" />
                                    <path d="M8 2v4" />
                                    <path d="M16 2v4" />
                                </svg>
                            </span>
                            <span>Riepilogo</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewTransactionButton />
                        </div>
                    </div>

                    {/* ───────── Subtitle ───────── */}
                    <p className="text-xs md:text-sm text-[hsl(var(--c-text-secondary))] text-left md:text-center">
                        Visualizza entrate e spese giorno per giorno in modo ordinato e intuitivo.
                    </p>
                </div>
            </div>

            {loading ? (
                <CalendarGridSkeleton />
            ) : (
                <CalendarGrid transactions={transactions} onDayClick={handleDayClick} />
            )}

            <DayTransactionsModal
                open={selectedDate !== null}
                onClose={() => setSelectedDate(null)}
                date={selectedDate || new Date()}
                transactions={selectedTx}
            />
        </div>
    );
}
