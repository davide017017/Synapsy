// ========================================
// TransactionTable.tsx
// ========================================
"use client";

import React, { useMemo, useCallback } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, Row } from "@tanstack/react-table";
import { addMonthGroup } from "./table/utils";
import { getColumnsWithSelection } from "./table/columns";
import type { TransactionTableProps, TransactionWithGroup } from "@/types/transazioni/list";
import TableRow from "./table/TableRow";
import MonthDividerRow from "./table/MonthDividerRow";
import YearDividerRow from "./table/YearDividerRow";
import { useSelection } from "@/context/SelectionContext";

// ── helpers condivisi (stessi del Context) ───────────
import { toNum } from "@/lib/finance";

// =========================
// Heuristic centesimi (come Context)
// =========================
const useAmountsAreCents = (data: TransactionWithGroup[]) => {
    return useMemo(() => {
        const nums = data
            .slice(0, 100)
            .map((t) => toNum((t as any).amount))
            .map(Math.abs)
            .filter(Boolean);
        if (!nums.length) return false;
        const over10k = nums.filter((n) => n >= 10_000).length;
        return over10k / nums.length >= 0.2;
    }, [data]);
};

// =========================
// Calcolo totali mensili (single pass)
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

    // Importi in centesimi? (auto-detected)
    const amountsAreCents = useAmountsAreCents(dataWithGroups);
    const amountOf = useCallback(
        (tx: TransactionWithGroup) => {
            const n = toNum((tx as any).amount);
            return amountsAreCents ? n / 100 : n;
        },
        [amountsAreCents]
    );

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

    // Raggruppo per YYYY-MM + totali per anno
    const groupedRows: Record<string, Row<TransactionWithGroup>[]> = {};
    for (const row of table.getRowModel().rows) {
        const key = row.original.monthGroup;
        if (!groupedRows[key]) groupedRows[key] = [];
        groupedRows[key].push(row);
    }

    const yearTotals: Record<string, { entrate: number; spese: number }> = {};
    Object.entries(groupedRows).forEach(([monthKey, rows]) => {
        const [year] = monthKey.split("-");
        if (!yearTotals[year]) yearTotals[year] = { entrate: 0, spese: 0 };
        for (const r of rows) {
            const amount = amountOf(r.original);
            if (r.original.category?.type === "entrata") yearTotals[year].entrate += amount;
            else if (r.original.category?.type === "spesa") yearTotals[year].spese += amount;
        }
    });

    // Render
    return (
        <div className="table-container overflow-x-auto bg-[hsl(var(--c-table-bg))] rounded-2xl border border-[hsl(var(--c-table-divider))] shadow">
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

                            // Divider ANNO
                            if (year !== lastYear) {
                                lastYear = year;
                                blocco.push(
                                    <YearDividerRow
                                        key={`anno-${year}`}
                                        year={year}
                                        colSpan={columns.length}
                                        entrate={yearTotals[year].entrate}
                                        spese={yearTotals[year].spese}
                                        saldo={yearTotals[year].entrate - yearTotals[year].spese}
                                        className="rounded-top bg-[hsl(var(--c-table-divider-year-bg))] text-[hsl(var(--c-table-header-text))]"
                                    />
                                );
                            }

                            // Divider MESE
                            const m = calcMonthTotals(rows, amountOf);
                            blocco.push(
                                <MonthDividerRow
                                    key={`mese-${monthKey}`}
                                    monthKey={monthKey}
                                    colSpan={columns.length}
                                    entrate={m.entrate}
                                    spese={m.spese}
                                    saldo={m.saldo}
                                    className="rounded-top bg-[hsl(var(--c-table-divider-month-bg))] text-[hsl(var(--c-table-header-text))]"
                                />
                            );

                            // Righe ordinate per data desc
                            const rowsOrdinati = [...rows].sort(
                                (a, b) => new Date(b.original.date).getTime() - new Date(a.original.date).getTime()
                            );

                            rowsOrdinati.forEach((row, idx) => {
                                const isLast = idx === rowsOrdinati.length - 1;
                                blocco.push(
                                    <TableRow
                                        key={row.id}
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
    );
}

// ─────────────────────────────────────────────────────
// Descrizione file:
// Tabella transazioni. Usa `toNum` condiviso e mantiene
// la stessa euristica dei centesimi del Context senza
// duplicare codice. Totali/Divider coerenti con HeroSaldo.
// ─────────────────────────────────────────────────────
