"use client";

import { useTransactions } from "@/context/TransactionsContext";
import { eur } from "@/utils/formatCurrency";
import { CalendarDays, Calendar, BarChart3 } from "lucide-react";

// ---------------------------
// Color helper
// ---------------------------
function color(value: number) {
    return value >= 0 ? "text-emerald-500" : "text-red-500";
}

// ---------------------------
// Week number helper
// ---------------------------
function getWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ---------------------------
// Component
// ---------------------------
export default function HeroSaldo() {
    const { monthBalance, yearBalance, weekBalance, totalBalance, loading } = useTransactions();

    const now = new Date();
    const currentMonthName = now.toLocaleString("it-IT", { month: "long" });
    const monthLabel = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
    const currentYear = now.getFullYear();
    const currentWeek = getWeekNumber(now);

    return (
        <div className="flex flex-col h-full justify-center px-4 text-center">
            {/* Totale grande */}
            <div className="mb-5">
                <div className="text-base opacity-60">Saldo attuale</div>
                <div className={`text-4xl font-bold ${color(totalBalance)}`}>{loading ? "—" : eur(totalBalance)}</div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-5 mt-2">
                {/* Week */}
                <div className="flex flex-col items-center gap-2">
                    <CalendarDays className="w-6 h-6 opacity-70" />
                    <div className="text-sm opacity-60">Week {currentWeek}</div>
                    <div className={`text-base font-semibold ${color(weekBalance)}`}>{loading ? "—" : eur(weekBalance)}</div>
                </div>

                {/* Month */}
                <div className="flex flex-col items-center gap-2">
                    <Calendar className="w-6 h-6 opacity-70" />
                    <div className="text-sm opacity-60">{monthLabel}</div>
                    <div className={`text-base font-semibold ${color(monthBalance)}`}>{loading ? "—" : eur(monthBalance)}</div>
                </div>

                {/* Year */}
                <div className="flex flex-col items-center gap-2">
                    <BarChart3 className="w-6 h-6 opacity-70" />
                    <div className="text-sm opacity-60">{currentYear}</div>
                    <div className={`text-base font-semibold ${color(yearBalance)}`}>{loading ? "—" : eur(yearBalance)}</div>
                </div>
            </div>
        </div>
    );
}
