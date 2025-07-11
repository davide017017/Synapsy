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
            <div className="flex items-center justify-between rounded-2xl bg-bg-elevate px-5 py-4 shadow-md border border-border">
                <h1 className="text-2xl font-bold">📅 Riepilogo con Calendario</h1>
                <NewTransactionButton />
            </div>
            {loading ? <CalendarGridSkeleton /> : <CalendarGrid transactions={transactions} />}
        </div>
    );
}
