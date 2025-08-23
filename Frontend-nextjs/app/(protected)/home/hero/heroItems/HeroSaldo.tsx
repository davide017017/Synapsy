"use client";

// ======================================================================
// HeroSaldo — riepilogo saldi (mese, anno, settimana, totale)
// ======================================================================
import { useTransactions } from "@/context/TransactionsContext";

// ----------------------------------------------------------------------
// Helpers locali: formattazione valuta e colore saldo
// ----------------------------------------------------------------------
function formatCurrency(value: number) {
    return value.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    });
}

// Colore testo: verde se positivo o zero, rosso se negativo
function getBalanceColor(value: number) {
    return value >= 0 ? "text-emerald-500" : "text-red-500";
}

// ----------------------------------------------------------------------
// Componente principale
// ----------------------------------------------------------------------
export default function HeroSaldo() {
    // Dati dal context
    const { monthBalance, yearBalance, weekBalance, totalBalance } = useTransactions();

    // Data corrente
    const now = new Date();
    const currentMonthName = now.toLocaleString("it-IT", { month: "long" });
    const currentYear = now.getFullYear();

    // Render
    return (
        <div className="px-4 text-center">
            <h2 className="text-lg font-bold mb-2">Saldo attuale</h2>

            {/* =========== SALDO SETTIMANA =========== */}
            <p className="text-base mb-1">
                <span className="font-medium">Settimana:</span>{" "}
                <span className={`font-semibold ${getBalanceColor(weekBalance)}`}>{formatCurrency(weekBalance)}</span>
            </p>

            {/* =========== SALDO MESE =========== */}
            <p className="text-base mb-1">
                <span className="font-medium">Mese ({currentMonthName}):</span>{" "}
                <span className={`font-semibold ${getBalanceColor(monthBalance)}`}>{formatCurrency(monthBalance)}</span>
            </p>

            {/* =========== SALDO ANNO =========== */}
            <p className="text-base mb-1">
                <span className="font-medium">Anno ({currentYear}):</span>{" "}
                <span className={`font-semibold ${getBalanceColor(yearBalance)}`}>{formatCurrency(yearBalance)}</span>
            </p>

            {/* =========== SALDO TOTALE =========== */}
            <p className="text-base mb-2">
                <span className="font-medium">Totale:</span>{" "}
                <span className={`font-semibold ${getBalanceColor(totalBalance)}`}>{formatCurrency(totalBalance)}</span>
            </p>
        </div>
    );
}
