// app/(protected)/home/hero/heroItems/HeroSaldo.tsx
"use client";

import { useTransactions } from "@/context/contexts/TransactionsContext";

// ─────────────────────────────────────────────────────────────────────────────
// HeroSaldo — legge monthBalance e yearBalance dal TransactionsContext
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSaldo() {
    // ── Prendo i saldi dal context ──
    const { monthBalance, yearBalance } = useTransactions();

    // ── Data corrente ──
    const now = new Date();
    const currentMonthName = now.toLocaleString("it-IT", { month: "long" });
    const currentYear = now.getFullYear();

    // ── Formattatore valuta ──
    const formatCurrency = (value: number) =>
        value.toLocaleString("it-IT", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
        });

    return (
        <div className="px-4 text-center">
            <h2 className="text-lg font-bold mb-2">Saldo attuale</h2>

            <p className="text-base mb-1">
                <span className="font-medium">Mese ({currentMonthName}):</span>{" "}
                <span className="text-emerald-400 font-semibold">{formatCurrency(monthBalance)}</span>
            </p>

            <p className="text-base mb-2">
                <span className="font-medium">Anno ({currentYear}):</span>{" "}
                <span className="text-emerald-400 font-semibold">{formatCurrency(yearBalance)}</span>
            </p>
        </div>
    );
}
