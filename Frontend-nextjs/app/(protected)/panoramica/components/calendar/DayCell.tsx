"use client";

// ╔═══════════════════════════════════════════════════════╗
// ║ DayCell.tsx — Cella giorno calendario stile dashboard║
// ║ - Stile e spazi come Figma                           ║
// ║ - Colonne verticali altezza importo                  ║
// ║ - Tooltip, layout a grid                             ║
// ╚═══════════════════════════════════════════════════════╝

import { Transaction } from "@/types/models/transaction";
import type { DayCellProps } from "@/types";
import { eur } from "@/utils/formatCurrency";
import { toNum } from "@/lib/finance";

// ----------- Funzione somma importi ----------- //
const somma = (arr: Transaction[]) => arr.reduce((tot, t) => tot + toNum((t as any).amount), 0);

// ----------- Componente principale ----------- //
export default function DayCell({
    day,
    date,
    monthDelta,
    transactions,
    showWeekDay,
    onClickDay,
    maxImporto,
}: DayCellProps) {
    // Oggi
    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    // Stili dinamici
    const isSunday = date.getDay() === 0;
    const opacity = monthDelta === 0 ? "" : "opacity-40";
    const border = isSunday ? "border-2 border-warning rounded-2xl" : "border border-primary/40 rounded-xl";
    const todayClass = isToday && monthDelta === 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-bg" : "";

    // Label giorno settimana
    const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    const weekDayLabel = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];

    // Dati transazioni
    const entrate = transactions.filter((t) => t.category?.type === "entrata");
    const spese = transactions.filter((t) => t.category?.type === "spesa");

    const totaleEntrate = somma(entrate);
    const totaleSpese = somma(spese);
    const txCount = transactions.length;

    // Altezza colonne: normalizza sull'importo massimo del MESE
    const barMaxHeight = 70;
    const minHeight = 16;
    // Se non vuoi mai vedere una colonna minuscola quando c'è importo molto basso, puoi portare minHeight a 10
    const barEntrate = entrate.length > 0 ? Math.max(minHeight, (totaleEntrate / maxImporto) * barMaxHeight) : 0;
    const barSpese = spese.length > 0 ? Math.max(minHeight, (totaleSpese / maxImporto) * barMaxHeight) : 0;

    // Tooltip testuale
    const tooltip =
        transactions.length === 0
            ? ""
            : `Entrate: ${entrate.length} (${eur(totaleEntrate)})\n
                Spese: ${spese.length} (${eur(totaleSpese)})`;

    // -------------------------- //
    // ------- RENDER UI -------- //
    // -------------------------- //
    return (
        <div
            className={`
                bg-bg-elevate rounded-xl p-1 w-full h-[90px]
                grid grid-cols-[1.1fr_1fr] gap-1 shadow-sm
                ${opacity} ${border} ${todayClass}
                transition-all duration-150
                cursor-${onClickDay ? "pointer" : "default"}
            `}
            title={tooltip}
            onClick={() => {
                if (onClickDay) onClickDay(date, transactions);
            }}
        >
            {/* ==== SINISTRA: Info giorno ==== */}
            <div className="flex flex-col justify-between h-full pl-0.5">
                {/* Giorno & “OGGI” */}
                <div className="flex items-center gap-1">
                    {showWeekDay && <span className="text-[9px] text-gray-400">{weekDayLabel}</span>}
                    <span className="text-xl font-black leading-none">{day}</span>
                    {isToday && monthDelta === 0 && (
                        <span className="ml-1 px-1 rounded bg-primary text-bg text-[9px] font-bold tracking-wider animate-pulse">
                            OGGI
                        </span>
                    )}
                </div>
                {/* Riepilogo */}
                <div className="mt-auto mb-0.5 text-[10px] font-medium leading-4 whitespace-nowrap">
                    <div>{txCount} TX</div>
                    <div>
                        <span className="text-primary whitespace-nowrap">In: {entrate.length}</span>
                    </div>
                    <div>
                        <span className="text-orange-400 whitespace-nowrap">Out: {spese.length}</span>
                    </div>
                </div>
            </div>

            {/* ==== DESTRA: Colonne verticali ==== */}
            <div className="flex h-full items-end justify-center gap-1 pr-0.5">
                {/* Entrate */}
                {entrate.length > 0 && (
                    <div className="flex flex-col items-center justify-end h-full w-8">
                        <div
                            className="w-full rounded-t-lg bg-primary flex items-end justify-center relative"
                            style={{ height: `${barEntrate}px`, minHeight: `${minHeight}px` }}
                        >
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-bg font-semibold">
                                {eur(totaleEntrate)}
                            </span>
                        </div>
                        <span className="mt-0.5 text-[8px] text-primary font-semibold">Entrate</span>
                    </div>
                )}
                {/* Spese */}
                {spese.length > 0 && (
                    <div className="flex flex-col items-center justify-end h-full w-9">
                        <div
                            className="w-full rounded-t-lg bg-orange-400 flex items-end justify-center relative"
                            style={{ height: `${barSpese}px`, minHeight: `${minHeight}px` }}
                        >
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-bg font-semibold">
                                {eur(totaleSpese)}
                            </span>
                        </div>
                        <span className="mt-0.5 text-[8px] text-orange-400 font-semibold">Spese</span>
                    </div>
                )}
                {/* Se nessuna transazione */}
                {entrate.length === 0 && spese.length === 0 && <div className="w-12 h-3"></div>}
            </div>
        </div>
    );
}

