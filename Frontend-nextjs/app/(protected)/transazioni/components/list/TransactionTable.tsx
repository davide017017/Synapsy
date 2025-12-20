// ========================================
// TransactionTable.tsx
// Look: divider anno/mese compatti + parziali (entrate/spese/saldo)
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
    // Helper: render divider compatti (anno/mese) con parziali
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
                <td colSpan={colSpan} className="px-4 py-2 border-b border-[hsl(var(--c-table-divider))]">
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

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <div className="inline-block min-w-full align-middle bg-[hsl(var(--c-table-bg))] rounded-2xl border border-[hsl(var(--c-table-divider))] shadow">
                <table className="table-base min-w-full">
                    {/* ── Intestazione ── */}
                    <thead className="bg-[hsl(var(--c-table-header-bg))] text-[hsl(var(--c-table-header-text))]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="table-header-row border-b border-[hsl(var(--c-table-divider))]"
                            >
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
                            const blocks = Object.entries(groupedRows).sort(([a], [b]) => b.localeCompare(a));

                            return blocks.flatMap(([monthKey, rows]) => {
                                const [year] = monthKey.split("-");
                                const blocco: React.ReactNode[] = [];

                                // Divider ANNO (compatto + parziali)
                                if (year !== lastYear) {
                                    lastYear = year;

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

                                const rowsOrdinati = [...rows].sort(
                                    (a, b) => new Date(b.original.date).getTime() - new Date(a.original.date).getTime()
                                );

                                rowsOrdinati.forEach((row, idx) => {
                                    const isLast = idx === rowsOrdinati.length - 1;

                                    blocco.push(
                                        <TableRow
                                            key={`${row.original.id}-${row.original.date}-${row.id}`}
                                            row={row}
                                            onClick={onRowClick}
                                            className={`
                                                ${isLast ? "rounded-b-xl" : ""}
                                                ${
                                                    row.original.id === selectedId
                                                        ? "bg-[hsl(var(--c-table-row-selected))] border-l-4 border-[hsl(var(--c-primary))] shadow-inner"
                                                        : "hover:bg-[hsl(var(--c-table-row-hover))]"
                                                }
                                                border-b border-[hsl(var(--c-table-divider))] transition-colors
                                            `}
                                            selected={row.original.id === selectedId}
                                        />
                                    );
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
Scopo: tabella transazioni con raggruppamento per mese/anno e selection mode.
Come:
- Usa TanStack Table + addMonthGroup().
- Divider compatti per ANNO e MESE dentro <tbody>.
- Divider mostrano: Entrate (verde), Spese (rosso), Saldo (verde/rosso) con etichette chiare.
- Righe: gestite da TableRow (stile/selection invariati).
*/
