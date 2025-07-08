"use client";

// ╔═════════════════════════════════════════════════════════╗
// ║         TransactionTable.tsx — Tabella transazioni     ║
// ╚═════════════════════════════════════════════════════════╝

import React, { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, Row } from "@tanstack/react-table";
import { Transaction } from "@/types/types/transaction";
import { addMonthGroup } from "./table/utils";
import { getColumnsWithSelection } from "./table/columns";
import { TransactionWithGroup } from "./table/types";
import TableRow from "./table/TableRow";
import MonthDividerRow from "./table/MonthDividerRow";
import YearDividerRow from "./table/YearDividerRow";
import { useSelection } from "@/context/contexts/SelectionContext";

// =============================
// Props
// =============================
type Props = {
    data: Transaction[];
    onRowClick?: (t: Transaction) => void;
    selectedId?: number | null;
};

// =============================
// TransactionTable principale
// =============================
export default function TransactionTable({ data, onRowClick, selectedId }: Props) {
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();

    // ------ Toggle selezione singola ------
    const handleCheckToggle = (id: number) => {
        setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
    };

    // ------ Toggle selezione tutti ------
    const dataWithGroups = useMemo(() => addMonthGroup(data), [data]);
    const allIds = useMemo(() => dataWithGroups.map((tx) => tx.id), [dataWithGroups]);
    const handleCheckAllToggle = (checked: boolean) => {
        setSelectedIds((ids) => (checked ? allIds : ids.filter((id) => !allIds.includes(id))));
    };

    // ------ Colonne ------
    const columns = useMemo(
        () => getColumnsWithSelection(isSelectionMode, selectedIds, handleCheckToggle, handleCheckAllToggle, allIds),
        [isSelectionMode, selectedIds, allIds]
    );

    // ------ Setup TanStack Table ------
    const table = useReactTable({
        data: dataWithGroups,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange" as ColumnResizeMode,
        debugTable: false,
    });

    // ------ Raggruppa righe per "YYYY-MM" ------
    const groupedRows: Record<string, Row<TransactionWithGroup>[]> = {};
    for (const row of table.getRowModel().rows) {
        const key = row.original.monthGroup;
        if (!groupedRows[key]) groupedRows[key] = [];
        groupedRows[key].push(row);
    }

    // ------ Totali per anno ------
    const yearTotals: Record<string, { entrate: number; spese: number }> = {};
    Object.entries(groupedRows).forEach(([monthKey, rows]) => {
        const [year] = monthKey.split("-");
        if (!yearTotals[year]) yearTotals[year] = { entrate: 0, spese: 0 };
        rows.forEach((row) => {
            if (row.original.category?.type === "entrata") yearTotals[year].entrate += row.original.amount || 0;
            else if (row.original.category?.type === "spesa") yearTotals[year].spese += row.original.amount || 0;
        });
    });

    // =========================
    // Render tabella
    // =========================
    return (
        <div className="table-container overflow-x-auto">
            <table className="table-base min-w-full">
                {/* Intestazione */}
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="table-header-row">
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="relative">
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
                {/* Corpo */}
                <tbody>
                    {/* Blocchi raggruppati per mese/anno */}
                    {(() => {
                        let lastYear = "";
                        const blocks = Object.entries(groupedRows).sort(([a], [b]) => b.localeCompare(a));

                        return blocks.flatMap(([monthKey, rows]) => {
                            const [year] = monthKey.split("-");
                            const blocco: React.ReactNode[] = [];

                            // --- Divider ANNO ---
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
                                        className="rounded-top"
                                    />
                                );
                            }

                            // --- Divider MESE ---
                            blocco.push(
                                <MonthDividerRow
                                    key={`mese-${monthKey}`}
                                    monthKey={monthKey}
                                    colSpan={columns.length}
                                    entrate={rows.reduce(
                                        (a, r) =>
                                            a + (r.original.category?.type === "entrata" ? r.original.amount || 0 : 0),
                                        0
                                    )}
                                    spese={rows.reduce(
                                        (a, r) =>
                                            a + (r.original.category?.type === "spesa" ? r.original.amount || 0 : 0),
                                        0
                                    )}
                                    saldo={
                                        rows.reduce(
                                            (a, r) =>
                                                a +
                                                (r.original.category?.type === "entrata" ? r.original.amount || 0 : 0),
                                            0
                                        ) -
                                        rows.reduce(
                                            (a, r) =>
                                                a +
                                                (r.original.category?.type === "spesa" ? r.original.amount || 0 : 0),
                                            0
                                        )
                                    }
                                    className="rounded-top"
                                />
                            );

                            // === Ecco la modifica: ordina per data discendente ===
                            const rowsOrdinati = [...rows].sort(
                                (a, b) =>
                                    // Descending (più recente in cima)
                                    new Date(b.original.date).getTime() - new Date(a.original.date).getTime()
                            );

                            rowsOrdinati.forEach((row, idx) => {
                                const isLast = idx === rowsOrdinati.length - 1;
                                blocco.push(
                                    <TableRow
                                        key={row.id}
                                        row={row}
                                        onClick={onRowClick}
                                        className={isLast ? "rounded-bottom" : ""}
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
