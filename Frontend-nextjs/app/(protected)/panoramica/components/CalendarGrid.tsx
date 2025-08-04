"use client";

// ╔═══════════════════════════════════════════════════════════════╗
// ║ CalendarGrid.tsx — Calendario avanzato stile Google Calendar ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Transaction } from "@/types/models/transaction";
import type { CalendarGridProps } from "@/types";
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

// ============================
// CalendarGrid principale
// ============================
export default function CalendarGrid({ transactions, onDayClick }: CalendarGridProps) {
    // Stato visualizzazione mese/anno
    const isLg = useMediaQuery("(min-width: 1024px)");
    const [viewYear, setViewYear] = useState(currentYear);
    const [viewMonth, setViewMonth] = useState(currentMonth);
    const [direction, setDirection] = useState<1 | -1>(1);

    // --- Cambia mese con animazione ---
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

    // --- Torna al mese corrente ---
    const goToToday = () => {
        setViewYear(currentYear);
        setViewMonth(currentMonth);
        setDirection(1);
    };
    const isCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;

    // --- Genera celle e settimane ---
    const { cells, weeks } = getCalendarGrid(viewYear, viewMonth, { withWeekNumbers: true });

    // ==========================
    // Calcolo massimo importo su TUTTA la griglia visibile
    // (inclusi giorni di mese precedente/successivo mostrati nella griglia)
    // ==========================
    const allDates = cells.map((c) => c.date);
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    // Prendi tutte le transazioni tra minDate e maxDate (inclusi giorni "fuori mese")
    const visibleGridTx = transactions.filter((tx) => {
        const txDate = typeof tx.date === "string" ? new Date(tx.date) : tx.date;
        return txDate >= minDate && txDate <= maxDate;
    });

    const maxEntrata = Math.max(
        0,
        ...visibleGridTx.filter((t) => t.category?.type === "entrata").map((t) => +t.amount)
    );
    const maxSpesa = Math.max(0, ...visibleGridTx.filter((t) => t.category?.type === "spesa").map((t) => +t.amount));
    const maxImportoGriglia = Math.max(maxEntrata, maxSpesa, 1);

    // ==========================
    // Varianti animazione mese
    // ==========================
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

    // ==========================
    // Render UI
    // ==========================
    return (
        <div>
            {/* Header calendario */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <button type="button" onClick={prevMonth} aria-label="Mese precedente">
                    <ChevronLeft size={22} />
                </button>
                <span className="text-xl font-bold select-none px-2 text-primary">{monthNames[viewMonth]}</span>
                <YearDropdown value={viewYear} options={yearOptions} onChange={setViewYear} />
                <button type="button" onClick={nextMonth} aria-label="Mese successivo">
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

            {/* Intestazione giorni settimana (desktop) */}
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

            {/* Griglia calendario animata */}
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
                                  // Desktop: tutte le tx della settimana
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
                                          maxImporto={maxImportoGriglia}
                                          onClickDay={onDayClick}
                                      />
                                  );
                              })
                            : cells.map((cell) => {
                                  // Mobile: tutte le tx del giorno
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
                                          maxImporto={maxImportoGriglia}
                                          onClickDay={onDayClick}
                                      />
                                  );
                              })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

