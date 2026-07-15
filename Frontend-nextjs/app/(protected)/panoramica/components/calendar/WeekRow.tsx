// ╔═══════════════════════════════════════════════════════════════╗
// ║ WeekRow.tsx — Riga settimana (numero + 7 giorni)             ║
// ╚═══════════════════════════════════════════════════════════════╝

import React from "react";
import DayCell from "./DayCell";
import { Transaction } from "@/types/models/transaction";
import type { WeekRowProps } from "@/types";

// ────────────────────────────────────────────────────────────────
// Helpers date (LOCAL DAY KEY)
// ────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, "0");
const localDateKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function WeekRow({
    week,
    transactions,
    maxImporto,
    onClickDay,
    ricorrenzePerGiorno,
}: WeekRowProps) {
    return (
        <>
            {/* Numero settimana */}
            <div className="flex items-center justify-center text-xs font-semibold text-primary bg-primary/5 rounded-lg border border-primary/20 px-1.5 py-1">
                {week.weekNumber}
            </div>
            {/* Celle giorno */}
            {week.days.map((cell) => {
                // Filtra transazioni del giorno
                const dayTx = transactions.filter((tx) => {
                    const txDate = typeof tx.date === "string" ? new Date(tx.date) : tx.date;
                    return (
                        txDate.getDate() === cell.date.getDate() &&
                        txDate.getMonth() === cell.date.getMonth() &&
                        txDate.getFullYear() === cell.date.getFullYear()
                    );
                });

                return (
                    <DayCell
                        key={cell.date.toISOString()}
                        day={cell.day}
                        date={cell.date}
                        monthDelta={cell.monthDelta}
                        transactions={dayTx}
                        showWeekDay={false}
                        maxImporto={maxImporto}
                        onClickDay={onClickDay}
                        ricorrenzeDelGiorno={ricorrenzePerGiorno?.get(localDateKey(cell.date)) ?? []}
                    />
                );
            })}
        </>
    );
}

