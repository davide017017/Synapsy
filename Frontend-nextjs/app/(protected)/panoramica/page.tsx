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
        <div className="space-y-2">
            <div
                className="
                    relative
                    rounded-2xl
                    border border-primary/20
                    bg-black/55
                    backdrop-blur-xl
                    p-3 md:p-5
                    shadow-[0_18px_55px_rgba(0,0,0,0.28)]
                    overflow-hidden
                    animate-fade-in
                "
            >
                {" "}
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
                        <h1
                            className="
                              flex items-center gap-2
                              font-mono
                              text-lg md:text-2xl
                              font-extrabold
                              uppercase
                              tracking-[0.14em]
                              text-primary
                              drop-shadow-[0_0_14px_hsl(var(--c-primary)/0.35)]
                          "
                        >
                            {" "}
                            <span className="inline-block w-5 h-5 md:w-6 md:h-6 text-primary">
                                {" "}
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
                            <span>Panoramica</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewTransactionButton />
                        </div>
                    </div>
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
