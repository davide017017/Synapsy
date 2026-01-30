"use client";

// ╔═══════════════════════════════════════════════════════╗
// ║ DayCell.tsx — Cella giorno calendario (mobile compact)║
// ║ - Mobile: ultra compatto per 7 colonne                 ║
// ║ - Desktop: mantiene layout 2 colonne con barre          ║
// ╚═══════════════════════════════════════════════════════╝

import { Transaction } from "@/types/models/transaction";
import type { DayCellProps } from "@/types";
import { eur } from "@/utils/formatCurrency";
import { toNum } from "@/lib/finance";

// ---------------------------
// Somma importi
// ---------------------------
const somma = (arr: Transaction[]) => arr.reduce((tot, t) => tot + toNum((t as any).amount), 0);

// ---------------------------
// Component
// ---------------------------
export default function DayCell({
    day,
    date,
    monthDelta,
    transactions,
    showWeekDay,
    onClickDay,
    maxImporto,
}: DayCellProps) {
    // ---------------------------
    // Today / styles
    // ---------------------------
    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isSunday = date.getDay() === 0;

    const opacity = monthDelta === 0 ? "" : "opacity-40";
    const border = isSunday ? "border-2 border-warning rounded-xl" : "border border-primary/40 rounded-xl";
    const todayClass = isToday && monthDelta === 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-bg" : "";

    // ---------------------------
    // Weekday label
    // ---------------------------
    const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    const weekDayLabel = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];

    // ---------------------------
    // Tx data
    // ---------------------------
    const entrate = transactions.filter((t) => t.category?.type === "entrata");
    const spese = transactions.filter((t) => t.category?.type === "spesa");

    const totaleEntrate = somma(entrate);
    const totaleSpese = somma(spese);
    const txCount = transactions.length;

    // ---------------------------
    // Bars (mobile smaller)
    // ---------------------------
    const barMaxHeightDesktop = 70;
    const barMaxHeightMobile = 26;

    const minHeightDesktop = 16;
    const minHeightMobile = 6;

    const barEntrateDesktop =
        entrate.length > 0 ? Math.max(minHeightDesktop, (totaleEntrate / maxImporto) * barMaxHeightDesktop) : 0;
    const barSpeseDesktop =
        spese.length > 0 ? Math.max(minHeightDesktop, (totaleSpese / maxImporto) * barMaxHeightDesktop) : 0;

    const barEntrateMobile =
        entrate.length > 0 ? Math.max(minHeightMobile, (totaleEntrate / maxImporto) * barMaxHeightMobile) : 0;
    const barSpeseMobile =
        spese.length > 0 ? Math.max(minHeightMobile, (totaleSpese / maxImporto) * barMaxHeightMobile) : 0;

    // ---------------------------
    // Tooltip
    // ---------------------------
    const tooltip =
        txCount === 0
            ? ""
            : `Entrate: ${entrate.length} (${eur(totaleEntrate)})\nSpese: ${spese.length} (${eur(totaleSpese)})`;

    // ---------------------------
    // Render
    // ---------------------------
    return (
        <div
            className={`
                bg-bg-elevate w-full
                ${opacity} ${border} ${todayClass}
                transition-all duration-150
                ${onClickDay ? "cursor-pointer" : "cursor-default"}

                /* Mobile compact */
                p-1.5 min-h-[58px]

                /* Desktop layout baseline */
                sm:p-2 sm:min-h-[90px]
            `}
            title={tooltip}
            onClick={() => {
                if (onClickDay) onClickDay(date, transactions);
            }}
        >
            {/* ======================================================
               MOBILE (default): layout compatto per 7 colonne
               ====================================================== */}
            <div className="sm:hidden">
                {/* Header riga */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {showWeekDay && <span className="text-[9px] opacity-60">{weekDayLabel}</span>}
                        <span className="text-sm font-black leading-none">{day}</span>

                        {isToday && monthDelta === 0 && (
                            <span className="px-1 rounded bg-primary text-bg text-[8px] font-bold leading-none">
                                OGGI
                            </span>
                        )}
                    </div>

                    {/* Mini TX */}
                    <div className="text-[9px] font-semibold opacity-70">{txCount}TX</div>
                </div>

                {/* Mini stats */}
                <div className="mt-1 flex items-center justify-between text-[9px] font-semibold">
                    <span className="text-primary">In {entrate.length}</span>
                    <span className="text-orange-400">Out {spese.length}</span>
                </div>

                {/* Mini bars */}
                <div className="mt-1 flex items-end gap-1 h-[26px]">
                    <div className="flex-1 rounded bg-white/5 overflow-hidden">
                        <div className="w-full bg-primary" style={{ height: `${barEntrateMobile}px` }} />
                    </div>
                    <div className="flex-1 rounded bg-white/5 overflow-hidden">
                        <div className="w-full bg-orange-400" style={{ height: `${barSpeseMobile}px` }} />
                    </div>
                </div>
            </div>

            {/* ======================================================
               DESKTOP (sm+): mantiene il tuo layout 2 colonne
               ====================================================== */}
            <div className="hidden sm:grid grid-cols-[1.1fr_1fr] gap-2 h-full">
                {/* ==== SINISTRA: Info giorno ==== */}
                <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center gap-1">
                        {showWeekDay && <span className="text-[9px] text-gray-400">{weekDayLabel}</span>}
                        <span className="text-xl font-black leading-none">{day}</span>

                        {isToday && monthDelta === 0 && (
                            <span className="ml-1 px-1 rounded bg-primary text-bg text-[9px] font-bold tracking-wider animate-pulse">
                                OGGI
                            </span>
                        )}
                    </div>

                    <div className="mt-auto text-[10px] font-medium leading-4 whitespace-nowrap">
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
                <div className="flex h-full items-end justify-center gap-2">
                    {entrate.length > 0 && (
                        <div className="flex flex-col items-center justify-end h-full w-8">
                            <div
                                className="w-full rounded-t-lg bg-primary relative"
                                style={{ height: `${barEntrateDesktop}px`, minHeight: `${minHeightDesktop}px` }}
                            >
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-bg font-semibold">
                                    {eur(totaleEntrate)}
                                </span>
                            </div>
                            <span className="mt-0.5 text-[8px] text-primary font-semibold">Entrate</span>
                        </div>
                    )}

                    {spese.length > 0 && (
                        <div className="flex flex-col items-center justify-end h-full w-9">
                            <div
                                className="w-full rounded-t-lg bg-orange-400 relative"
                                style={{ height: `${barSpeseDesktop}px`, minHeight: `${minHeightDesktop}px` }}
                            >
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-bg font-semibold">
                                    {eur(totaleSpese)}
                                </span>
                            </div>
                            <span className="mt-0.5 text-[8px] text-orange-400 font-semibold">Spese</span>
                        </div>
                    )}

                    {entrate.length === 0 && spese.length === 0 && <div className="w-12 h-3" />}
                </div>
            </div>
        </div>
    );
}

/* ===================================================
File: DayCell.tsx
Scopo: renderizza una cella giorno del calendario.
Come: su mobile usa layout compatto (7 colonne) con mini stats + mini barre; da sm in su mantiene layout dettagliato con barre e importi.
=================================================== */
