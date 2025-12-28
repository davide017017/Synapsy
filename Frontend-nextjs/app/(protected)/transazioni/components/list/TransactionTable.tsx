// ========================================
// TransactionTable.tsx
// Look: divider anno/mese/giorno compatti + parziali (entrate/spese/saldo)
// ========================================
"use client";

import React, { useMemo, useCallback } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, Row } from "@tanstack/react-table";
import { addMonthGroup } from "./table/utils";
import { getColumnsWithSelection } from "./table/columns";
import type { TransactionTableProps, TransactionWithGroup } from "@/types/transazioni/list";
import TableRow from "./table/TableRow";
import { useSelection } from "@/context/SelectionContext";

// ── helpers condivisi (stessi del Context) ───────────
import { toNum } from "@/lib/finance";

// =========================
// Helper: format importi (compatto)
// =========================
function formatAmount(amount: number) {
    try {
        return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount);
    } catch {
        return `${amount.toFixed(2)} €`;
    }
}

// =========================
// Helper: label mese (YYYY-MM -> "Mese YYYY")
// =========================
function monthLabel(monthKey: string) {
    const [y, m] = monthKey.split("-");
    const dt = new Date(Number(y), Math.max(0, Number(m) - 1), 1);
    return dt.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

// =========================
// Helper: dayKey (YYYY-MM-DD) da date string
// =========================
function toDayKey(dateStr: string) {
    const s = String(dateStr);
    const y = s.slice(0, 4);
    const m = s.slice(5, 7);
    const d = s.slice(8, 10);

    if (y.length === 4 && m.length === 2 && d.length === 2) return `${y}-${m}-${d}`;

    const dt = new Date(s);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

// =========================
// Helper: label giorno (YYYY-MM-DD -> "sab 28/12")
// =========================
function dayLabel(dayKey: string) {
    const [y, m, d] = dayKey.split("-");
    const dt = new Date(Number(y), Math.max(0, Number(m) - 1), Number(d));

    const weekday = dt.toLocaleDateString("it-IT", { weekday: "short" });
    const ddmm = dt.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });

    return `${weekday} ${ddmm}`;
}

// =========================
// Helper: calcolo totali mese (single pass)
// =========================
const calcMonthTotals = (rows: Row<TransactionWithGroup>[], amountOf: (tx: TransactionWithGroup) => number) => {
    let entrate = 0;
    let spese = 0;

    for (const r of rows) {
        const amount = amountOf(r.original);
        if (r.original.category?.type === "entrata") entrate += amount;
        else if (r.original.category?.type === "spesa") spese += amount;
    }

    return { entrate, spese, saldo: entrate - spese };
};

// =========================
// Helper: calcolo totali giorno (single pass)
// =========================
const calcDayTotals = (rows: Row<TransactionWithGroup>[], amountOf: (tx: TransactionWithGroup) => number) => {
    let entrate = 0;
    let spese = 0;

    for (const r of rows) {
        const amount = amountOf(r.original);
        if (r.original.category?.type === "entrata") entrate += amount;
        else if (r.original.category?.type === "spesa") spese += amount;
    }

    return { entrate, spese, saldo: entrate - spese };
};

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────
export default function TransactionTable({
    data,
    onRowClick,
    selectedId,
    isSelectionMode: propIsSelectionMode,
    selectedIds: propSelectedIds,
    setSelectedIds: propSetSelectedIds,
}: TransactionTableProps) {
    // Selection context (fallback)
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();

    // Priorità alle props
    const actualIsSelectionMode = propIsSelectionMode ?? isSelectionMode;
    const actualSelectedIds = propSelectedIds ?? selectedIds;
    const actualSetSelectedIds = propSetSelectedIds ?? setSelectedIds;

    // Dati + ID memo
    const dataWithGroups = useMemo(() => addMonthGroup(data), [data]);
    const allIds = useMemo(() => dataWithGroups.map((tx) => tx.id), [dataWithGroups]);

    // Importi in euro
    const amountOf = useCallback((tx: TransactionWithGroup) => toNum((tx as any).amount), []);

    // Handler stabili
    const handleCheckToggle = useCallback(
        (id: number) => {
            actualSetSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
        },
        [actualSetSelectedIds]
    );

    const handleCheckAllToggle = useCallback(
        (checked: boolean) => {
            actualSetSelectedIds((ids) => (checked ? allIds : ids.filter((id) => !allIds.includes(id))));
        },
        [actualSetSelectedIds, allIds]
    );

    // Colonne
    const columns = useMemo(
        () =>
            getColumnsWithSelection(
                actualIsSelectionMode,
                actualSelectedIds,
                handleCheckToggle,
                handleCheckAllToggle,
                allIds
            ),
        [actualIsSelectionMode, actualSelectedIds, allIds, handleCheckToggle, handleCheckAllToggle]
    );

    // Setup TanStack Table
    const table = useReactTable({
        data: dataWithGroups,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange" as ColumnResizeMode,
        debugTable: false,
    });

    // --------------------------------------------------
    // Raggruppo per YYYY-MM
    // --------------------------------------------------
    const groupedRows: Record<string, Row<TransactionWithGroup>[]> = {};
    for (const row of table.getRowModel().rows) {
        const key = row.original.monthGroup;
        if (!groupedRows[key]) groupedRows[key] = [];
        groupedRows[key].push(row);
    }

    // --------------------------------------------------
    // Totali per anno (entrate/spese/saldo)
    // --------------------------------------------------
    const yearTotals: Record<string, { entrate: number; spese: number; saldo: number }> = {};
    Object.entries(groupedRows).forEach(([monthKey, rows]) => {
        const [year] = monthKey.split("-");
        if (!yearTotals[year]) yearTotals[year] = { entrate: 0, spese: 0, saldo: 0 };

        for (const r of rows) {
            const amount = amountOf(r.original);
            if (r.original.category?.type === "entrata") yearTotals[year].entrate += amount;
            else if (r.original.category?.type === "spesa") yearTotals[year].spese += amount;
        }

        yearTotals[year].saldo = yearTotals[year].entrate - yearTotals[year].spese;
    });

    // --------------------------------------------------
    // Helper: divider compatti (anno/mese) con parziali
    // --------------------------------------------------
    const Divider = ({
        label,
        entrate,
        spese,
        saldo,
        colSpan,
        kind,
    }: {
        label: string;
        entrate: number;
        spese: number;
        saldo: number;
        colSpan: number;
        kind: "year" | "month";
    }) => {
        const saldoPositive = saldo >= 0;

        // Stile leggermente diverso anno vs mese (ma coerente)
        const baseBg =
            kind === "year" ? "bg-[hsl(var(--c-table-divider-year-bg))]" : "bg-[hsl(var(--c-table-divider-month-bg))]";
        const labelClass =
            kind === "year"
                ? "text-xs font-bold tracking-wider uppercase"
                : "text-[11px] font-semibold capitalize text-muted-foreground";

        return (
            <tr className={`${baseBg} text-[hsl(var(--c-table-header-text))]`}>
                <td colSpan={colSpan} className="px-4 py-2 ">
                    <div className="flex items-center justify-between gap-3">
                        <div className={labelClass}>{label}</div>

                        {/* ===== Totali compatti con etichette ===== */}
                        <div className="flex items-center gap-3 text-[11px] tabular-nums">
                            <span className="flex items-center gap-1">
                                <span className="opacity-80">Entrate:</span>
                                <span className="text-[hsl(var(--c-success))] font-semibold">
                                    +{formatAmount(entrate)}
                                </span>
                            </span>

                            <span className="flex items-center gap-1">
                                <span className="opacity-80">Spese:</span>
                                <span className="text-[hsl(var(--c-danger))] font-semibold">
                                    -{formatAmount(spese)}
                                </span>
                            </span>

                            <span className="flex items-center gap-1">
                                <span className="opacity-80">Saldo:</span>
                                <span
                                    className={`font-bold ${
                                        saldoPositive ? "text-[hsl(var(--c-success))]" : "text-[hsl(var(--c-danger))]"
                                    }`}
                                    title="Saldo"
                                >
                                    {formatAmount(saldo)}
                                </span>
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    // --------------------------------------------------
    // Helper: divider giorno (one-line) con SOLO saldo
    // --------------------------------------------------
    const DayDivider = ({ label, saldo, colSpan }: { label: string; saldo: number; colSpan: number }) => {
        const saldoPositive = saldo >= 0;

        return (
            <tr
                className="text-[hsl(var(--c-table-header-text))]"
                style={{
                    background: `
        linear-gradient(
            to bottom,
            hsl(var(--c-table-divider) / 0.35),
            transparent
        )
    `,
                }}
            >
                <td colSpan={colSpan} className="px-4 py-0.5 ">
                    <div className="flex items-center justify-between gap-3 leading-none">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {label}
                        </div>

                        <div className="text-[11px] tabular-nums flex items-center gap-2">
                            <span className="opacity-70">Saldo:</span>
                            <span
                                className={`font-bold ${
                                    saldoPositive ? "text-[hsl(var(--c-success))]" : "text-[hsl(var(--c-danger))]"
                                }`}
                            >
                                {formatAmount(saldo)}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <div className="inline-block min-w-full align-middle bg-[hsl(var(--c-table-bg))] rounded-2xl border border-[hsl(var(--c-table-divider))] shadow">
                <table className="table-base min-w-full">
                    {/* ── Intestazione ── */}
                    <thead className="bg-[hsl(var(--c-table-header-bg))] text-[hsl(var(--c-table-header-text))]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="table-header-row ">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="relative font-semibold text-sm px-4 py-2 text-left">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none"
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* ── Corpo ── */}
                    <tbody className="text-[hsl(var(--c-table-text))]">
                        {(() => {
                            let lastYear = "";
                            let lastDayKey = "";

                            const blocks = Object.entries(groupedRows).sort(([a], [b]) => b.localeCompare(a));

                            return blocks.flatMap(([monthKey, rows]) => {
                                const [year] = monthKey.split("-");
                                const blocco: React.ReactNode[] = [];

                                // Divider ANNO (compatto + parziali)
                                if (year !== lastYear) {
                                    lastYear = year;
                                    lastDayKey = "";

                                    const y = yearTotals[year] ?? { entrate: 0, spese: 0, saldo: 0 };
                                    blocco.push(
                                        <Divider
                                            key={`anno-${year}`}
                                            kind="year"
                                            label={year}
                                            entrate={y.entrate}
                                            spese={y.spese}
                                            saldo={y.saldo}
                                            colSpan={columns.length}
                                        />
                                    );
                                }

                                // Divider MESE (compatto + parziali)
                                const m = calcMonthTotals(rows, amountOf);
                                blocco.push(
                                    <Divider
                                        key={`mese-${monthKey}`}
                                        kind="month"
                                        label={monthLabel(monthKey)}
                                        entrate={m.entrate}
                                        spese={m.spese}
                                        saldo={m.saldo}
                                        colSpan={columns.length}
                                    />
                                );

                                // Righe ordinate per data DESC
                                const rowsOrdinati = [...rows].sort(
                                    (a, b) => new Date(b.original.date).getTime() - new Date(a.original.date).getTime()
                                );

                                // Group per giorno dentro al mese
                                const byDay: Record<string, Row<TransactionWithGroup>[]> = {};
                                for (const r of rowsOrdinati) {
                                    const dk = toDayKey(String(r.original.date));
                                    if (!byDay[dk]) byDay[dk] = [];
                                    byDay[dk].push(r);
                                }

                                // Giorni in ordine DESC (dk = YYYY-MM-DD)
                                const dayKeys = Object.keys(byDay).sort((a, b) => b.localeCompare(a));

                                dayKeys.forEach((dk) => {
                                    // Divider GIORNO (solo saldo)
                                    if (dk !== lastDayKey) {
                                        lastDayKey = dk;

                                        const dTotals = calcDayTotals(byDay[dk], amountOf);
                                        blocco.push(
                                            <DayDivider
                                                key={`giorno-${monthKey}-${dk}`}
                                                label={dayLabel(dk)}
                                                saldo={dTotals.saldo}
                                                colSpan={columns.length}
                                            />
                                        );
                                    }

                                    // Righe del giorno
                                    const dayRows = byDay[dk];

                                    dayRows.forEach((row, idx) => {
                                        const isLastInDay = idx === dayRows.length - 1;

                                        blocco.push(
                                            <TableRow
                                                key={`${row.original.id}-${row.original.date}-${row.id}`}
                                                row={row}
                                                onClick={onRowClick}
                                                className={`
                                                    ${isLastInDay ? "" : ""}
                                                    ${
                                                        row.original.id === selectedId
                                                            ? "bg-[hsl(var(--c-table-row-selected))] border-l-4 border-[hsl(var(--c-primary))] shadow-inner"
                                                            : "hover:bg-[hsl(var(--c-table-row-hover))]"
                                                    }
                                                    transition-colors
                                                `}
                                                selected={row.original.id === selectedId}
                                            />
                                        );
                                    });
                                });

                                return blocco;
                            });
                        })()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/*
File: TransactionTable.tsx
Scopo: tabella transazioni con raggruppamento per mese/anno/giorno e selection mode.
Come:
- Usa TanStack Table + addMonthGroup().
- Divider compatti per ANNO e MESE dentro <tbody> con Entrate/Spese/Saldo.
- Divider GIORNO (one-line) con SOLO saldo del giorno.
- Righe: gestite da TableRow (stile/selection invariati).
*/
