"use client";

import { useTransactions } from "@/context/TransactionsContext";

function formatCurrency(value: number) {
    return value.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    });
}
function color(value: number) {
    return value >= 0 ? "text-emerald-500" : "text-red-500";
}

export default function HeroSaldo() {
    const { monthBalance, yearBalance, weekBalance, totalBalance } = useTransactions();
    const now = new Date();
    const currentMonthName = now.toLocaleString("it-IT", { month: "long" });
    const currentYear = now.getFullYear();

    return (
        <div className="flex flex-col h-full justify-center">
            <div className="px-4 text-center">
                <h2 className="text-lg font-bold mb-2">Saldo attuale</h2>

                <p className="text-base mb-1">
                    <span className="font-medium">Settimana:</span>{" "}
                    <span className={`font-semibold ${color(weekBalance)}`}>{formatCurrency(weekBalance)}</span>
                </p>

                <p className="text-base mb-1">
                    <span className="font-medium">Mese ({currentMonthName}):</span>{" "}
                    <span className={`font-semibold ${color(monthBalance)}`}>{formatCurrency(monthBalance)}</span>
                </p>

                <p className="text-base mb-1">
                    <span className="font-medium">Anno ({currentYear}):</span>{" "}
                    <span className={`font-semibold ${color(yearBalance)}`}>{formatCurrency(yearBalance)}</span>
                </p>

                <p className="text-base mb-2">
                    <span className="font-medium">Totale:</span>{" "}
                    <span className={`font-semibold ${color(totalBalance)}`}>{formatCurrency(totalBalance)}</span>
                </p>
            </div>
        </div>
    );
}
