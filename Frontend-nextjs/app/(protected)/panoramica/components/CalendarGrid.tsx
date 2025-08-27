"use client";

/* ╔═══════════════════════════════════════════════════════════════╗
 * ║ CalendarGrid.tsx — Calendario avanzato stile Google Calendar  ║
 * ╚═══════════════════════════════════════════════════════════════╝ */

import { useMemo, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { Transaction } from "@/types/models/transaction";
import type { CalendarGridProps } from "@/types";
import DayCell from "./calendar/DayCell";
import { useMediaQuery } from "usehooks-ts";
import { getCalendarGrid } from "./calendar/utils/calendarUtils";
import { motion, AnimatePresence } from "framer-motion";
import WeekRow from "./calendar/WeekRow";
import YearDropdown from "./calendar/YearDropdown";

// ────────────────────────────────────────────────────────────────
// Helpers date (LOCAL DAY KEY)
// ────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, "0");
const localDateKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const anyToLocalKey = (val: Date | string) => {
    if (typeof val === "string") {
        // se è "YYYY-MM-DD" è già day-only
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
        return localDateKey(new Date(val));
    }
    return localDateKey(val);
};

// ────────────────────────────────────────────────────────────────
// Costanti UI
// ────────────────────────────────────────────────────────────────
const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
];
const weekDayShort = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

// ╔═══════════════════════════════════════════════════════════════╗
// ║ Component                                                     ║
/* ╚═══════════════════════════════════════════════════════════════╝ */
export default function CalendarGrid({ transactions, onDayClick }: CalendarGridProps) {
    // ── mount flag (no early return: usiamo skeleton in-place)
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // ── media query (evita mismatch SSR)
    const isLg = useMediaQuery("(min-width: 1024px)", { initializeWithValue: false });

    // ── stato mese/anno
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const [viewMonth, setViewMonth] = useState(currentMonth);
    const [viewYear, setViewYear] = useState(currentYear);
    const [direction, setDirection] = useState<1 | -1>(1);

    // ──────────────────────────────────────────────────────────────
    // Navigazione mesi
    // ──────────────────────────────────────────────────────────────
    const prevMonth = () => {
        setDirection(-1);
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };
    const nextMonth = () => {
        setDirection(1);
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };
    const goToToday = () => {
        setViewYear(currentYear);
        setViewMonth(currentMonth);
        setDirection(1);
    };
    const isCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;

    // ──────────────────────────────────────────────────────────────
    // Celle / settimane
    // ──────────────────────────────────────────────────────────────
    const { cells, weeks } = getCalendarGrid(viewYear, viewMonth, { withWeekNumbers: true });

    // ──────────────────────────────────────────────────────────────
    // Mappa data -> transazioni (chiave locale)
    // ──────────────────────────────────────────────────────────────
    const txByDate = useMemo(() => {
        const map = new Map<string, Transaction[]>();
        for (const tx of transactions) {
            const k = anyToLocalKey(tx.date as any);
            const arr = map.get(k);
            if (arr) arr.push(tx);
            else map.set(k, [tx]);
        }
        return map;
    }, [transactions]);

    const getTxForDate = useCallback((d: Date) => txByDate.get(localDateKey(d)) ?? [], [txByDate]);

    // ──────────────────────────────────────────────────────────────
    // Max importo per normalizzare barre/progress
    // ──────────────────────────────────────────────────────────────
    const visibleGridTx = useMemo(() => cells.flatMap((c) => getTxForDate(c.date)), [cells, getTxForDate]);
    const maxEntrata = Math.max(
        0,
        ...visibleGridTx.filter((t) => t.category?.type === "entrata").map((t) => +t.amount)
    );
    const maxSpesa = Math.max(0, ...visibleGridTx.filter((t) => t.category?.type === "spesa").map((t) => +t.amount));
    const maxImportoGriglia = Math.max(maxEntrata, maxSpesa, 1);

    // ──────────────────────────────────────────────────────────────
    // Animazioni (senza position absolute/relative)
    // ──────────────────────────────────────────────────────────────
    const variants = {
        enter: (dir: 1 | -1) => ({ x: dir * 50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: 1 | -1) => ({ x: -dir * 50, opacity: 0 }),
    };

    // ── skeleton al primo mount (no flash SSR)
    const showSkeleton = !mounted;

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║ Render                                                        ║
    // ╚═══════════════════════════════════════════════════════════════╝
    return (
        <div className="space-y-4">
            {/* ── Header calendario ─────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 opacity-70" />
                    <h2 className="text-lg font-semibold">
                        {monthNames[viewMonth]} {viewYear}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={prevMonth}
                        className="inline-flex items-center justify-center rounded-md border px-2 py-1 hover:bg-white/5"
                        aria-label="Mese precedente"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={goToToday}
                        disabled={isCurrentMonth}
                        className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Oggi
                    </button>

                    <button
                        type="button"
                        onClick={nextMonth}
                        className="inline-flex items-center justify-center rounded-md border px-2 py-1 hover:bg-white/5"
                        aria-label="Mese successivo"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <YearDropdown
                        value={viewYear}
                        options={[viewYear - 1, viewYear, viewYear + 1, viewYear + 2]}
                        onChange={(y) => setViewYear(y)}
                    />
                </div>
            </div>

            {/* ── Header giorni (desktop) ───────────────────────────── */}
            {isLg && (
                <div className="grid grid-cols-[auto_repeat(7,_1fr)] gap-2">
                    <div /> {/* placeholder colonna numeri settimana */}
                    {weekDayShort.map((d, i) => (
                        <div key={`${i}-${d}`} className="text-xs font-semibold text-center text-gray-400 select-none">
                            {d}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Griglia calendario ────────────────────────────────── */}
            <div className="relative min-h-[370px] overflow-hidden">
                {showSkeleton ? (
                    <div className="h-[370px] animate-pulse rounded-lg bg-white/5" />
                ) : (
                    <AnimatePresence custom={direction} initial={false}>
                        <motion.div
                            key={`${viewYear}-${viewMonth}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.18 }}
                            className={`grid gap-2 ${
                                isLg ? "grid-cols-[auto_repeat(7,_1fr)]" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
                            }`}
                        >
                            {isLg
                                ? weeks!.map((week) => {
                                      const weekTx = week.days.flatMap((d) => getTxForDate(d.date));
                                      return (
                                          <WeekRow
                                              key={week.weekNumber}
                                              week={week}
                                              transactions={weekTx}
                                              maxImporto={maxImportoGriglia}
                                              onClickDay={onDayClick}
                                          />
                                      );
                                  })
                                : cells.map((cell) => {
                                      const dayTx = getTxForDate(cell.date);
                                      return (
                                          <DayCell
                                              key={`day-${localDateKey(cell.date)}`}
                                              day={cell.day}
                                              date={cell.date}
                                              monthDelta={cell.monthDelta}
                                              transactions={dayTx}
                                              showWeekDay={false}
                                              maxImporto={maxImportoGriglia}
                                              onClickDay={onDayClick}
                                          />
                                      );
                                  })}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
