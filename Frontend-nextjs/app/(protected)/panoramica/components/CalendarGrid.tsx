"use client";

// ╔═══════════════════════════════════════════════════════════════╗
// ║ CalendarGrid.tsx — Calendario avanzato Google-style          ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Transaction } from "@/types/types/transaction";
import DayCell from "./calendar/DayCell";
import { useMediaQuery } from "usehooks-ts";
import { getCalendarGrid } from "./calendar/utils/calendarUtils";
import { motion, AnimatePresence } from "framer-motion";
import WeekRow from "./calendar/WeekRow";
import YearDropdown from "./calendar/YearDropdown";

// ============================
// Costanti
// ============================
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
const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const yearOptions = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);

// ============================
// Props
// ============================
type Props = { transactions: Transaction[] };

// ============================
// Componente principale
// ============================
export default function CalendarGrid({ transactions }: Props) {
    const isLg = useMediaQuery("(min-width: 1024px)");
    const [viewYear, setViewYear] = useState(currentYear);
    const [viewMonth, setViewMonth] = useState(currentMonth);
    const [direction, setDirection] = useState<1 | -1>(1);

    // ===== Cambio mese animato =====
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

    // ===== Torna a oggi =====
    const goToToday = () => {
        setViewYear(currentYear);
        setViewMonth(currentMonth);
        setDirection(1);
    };
    const isCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;

    // ===== Celle calendario =====
    const { cells, weeks } = getCalendarGrid(viewYear, viewMonth, { withWeekNumbers: true });

    // ===== Calcola massimo importo mese (tra tutte le tx di questo mese) =====
    // 1. Filtra transazioni di questo mese (anche se ci sono giorni da altri mesi in cells!)
    const visibleMonthTx = transactions.filter((tx) => {
        const txDate = typeof tx.date === "string" ? new Date(tx.date) : tx.date;
        return txDate.getFullYear() === viewYear && txDate.getMonth() === viewMonth;
    });
    // 2. Massimi
    const maxEntrata = Math.max(
        0,
        ...visibleMonthTx.filter((t) => t.category?.type === "entrata").map((t) => +t.amount)
    );
    const maxSpesa = Math.max(0, ...visibleMonthTx.filter((t) => t.category?.type === "spesa").map((t) => +t.amount));
    const maxImportoMese = Math.max(maxEntrata, maxSpesa, 1);

    // ===== Varianti animazione =====
    const variants = {
        enter: (dir: 1 | -1) => ({
            x: dir * 50,
            opacity: 0,
            position: "absolute" as const,
        }),
        center: { x: 0, opacity: 1, position: "relative" as const },
        exit: (dir: 1 | -1) => ({
            x: -dir * 50,
            opacity: 0,
            position: "absolute" as const,
        }),
    };

    // ============================
    // Render
    // ============================
    return (
        <div>
            {/* ===== Header calendario ===== */}
            <div className="flex items-center justify-center gap-2 mb-4">
                {/* ... bottoni header come prima ... */}
                <button type="button" onClick={prevMonth} aria-label="Mese precedente" /* ...stile... */>
                    <ChevronLeft size={22} />
                </button>
                <span className="text-xl font-bold select-none px-2 text-primary">{monthNames[viewMonth]}</span>
                <YearDropdown value={viewYear} options={yearOptions} onChange={setViewYear} />
                <button type="button" onClick={nextMonth} aria-label="Mese successivo" /* ...stile... */>
                    <ChevronRight size={22} />
                </button>
                <button
                    type="button"
                    onClick={goToToday}
                    disabled={isCurrentMonth}
                    className={`
                        ml-4 px-3 py-1.5 rounded-full flex items-center gap-2 font-bold text-sm
                        border-2 border-primary transition
                        ${
                            isCurrentMonth
                                ? "opacity-60 bg-primary/10 text-primary"
                                : "bg-gradient-to-r from-primary/40 to-primary/20 text-primary hover:from-primary/70 hover:to-primary/40 hover:scale-105 active:scale-95"
                        }
                    `}
                >
                    <Calendar size={16} /> Oggi
                </button>
            </div>

            {/* ===== Intestazione giorni settimana (desktop) ===== */}
            {isLg && (
                <div className="grid grid-cols-[auto_repeat(7,_1fr)] mb-2">
                    <div className="flex items-center justify-center text-xs font-bold text-primary select-none px-1.5 py-1">
                        Week
                    </div>
                    {daysOfWeek.map((d) => (
                        <div key={d} className="text-xs font-semibold text-center text-gray-400 select-none">
                            {d}
                        </div>
                    ))}
                </div>
            )}

            {/* ===== Griglia animata ===== */}
            <div className="relative min-h-[370px]">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={viewYear + "-" + viewMonth}
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
                                  // Desktop: filtra transazioni della settimana
                                  const weekStart = week.days[0].date;
                                  const weekEnd = week.days[6].date;
                                  const weekTx = transactions.filter((tx) => {
                                      const txDate = typeof tx.date === "string" ? new Date(tx.date) : tx.date;
                                      return txDate >= weekStart && txDate <= weekEnd;
                                  });

                                  return (
                                      <WeekRow
                                          key={week.weekNumber}
                                          week={week}
                                          transactions={weekTx}
                                          maxImporto={maxImportoMese} // <<< PASSA QUI
                                      />
                                  );
                              })
                            : cells.map((cell) => {
                                  // Mobile: filtra transazioni del giorno
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
                                          maxImporto={maxImportoMese} // <<< PASSA QUI
                                      />
                                  );
                              })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
