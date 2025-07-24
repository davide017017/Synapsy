// ╔═══════════════════════════════════════════════════════════════╗
// ║ WeekRow.tsx — Riga settimana (numero + 7 giorni)             ║
// ╚═══════════════════════════════════════════════════════════════╝

import React from "react";
import DayCell from "./DayCell";
import { Transaction } from "@/types/models/transaction";
import type { WeekRowProps } from "@/types";

export default function WeekRow({ week, transactions, maxImporto }: WeekRowProps) {
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
                    />
                );
            })}
        </>
    );
}
