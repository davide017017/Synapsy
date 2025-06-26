"use client";

// ╔════════════════════════════════════════════════════╗
// ║  Import principali                               ║
// ╚════════════════════════════════════════════════════╝
import React, { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, Row } from "@tanstack/react-table";
import { Transaction } from "@/types/types/transaction";
import { addMonthGroup } from "./table/utils";
import { columns } from "./table/columns";
import { TransactionWithGroup } from "./table/types";
import TableRow from "./table/TableRow";
import MonthDividerRow from "./table/MonthDividerRow";
import YearDividerRow from "./table/YearDividerRow";

// ╔════════════════════════════════════════════════════╗
// ║  Tipi props                                      ║
// ╚════════════════════════════════════════════════════╝
type Props = {
    data: Transaction[];
    onRowClick?: (t: Transaction) => void;
    selectedId?: number | null;
};

// ╔════════════════════════════════════════════════════╗
// ║  Componente principale - TransactionTable         ║
// ╚════════════════════════════════════════════════════╝
export default function TransactionTable({ data, onRowClick }: Props) {
    // ────────────────────────────────
    // Prepara dati con gruppi mese
    // ────────────────────────────────
    const dataWithGroups = useMemo(() => addMonthGroup(data), [data]);

    // ────────────────────────────────
    // Setup TanStack Table
    // ────────────────────────────────
    const table = useReactTable({
        data: dataWithGroups,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange" as ColumnResizeMode,
        debugTable: false,
    });

    // ────────────────────────────────
    // Raggruppa righe per "YYYY-MM"
    // ────────────────────────────────
    const groupedRows: Record<string, Row<TransactionWithGroup>[]> = {};
    for (const row of table.getRowModel().rows) {
        const key = row.original.monthGroup;
        if (!groupedRows[key]) groupedRows[key] = [];
        groupedRows[key].push(row);
    }

    // ────────────────────────────────
    // Calcola totali annuali (entrate/spese)
    // ────────────────────────────────
    const yearTotals: { [year: string]: { entrate: number; spese: number } } = {};
    Object.entries(groupedRows).forEach(([monthKey, rows]) => {
        const [year] = monthKey.split("-");
        if (!yearTotals[year]) yearTotals[year] = { entrate: 0, spese: 0 };
        rows.forEach((row) => {
            if (row.original.category?.type === "entrata") yearTotals[year].entrate += row.original.amount || 0;
            else if (row.original.category?.type === "spesa") yearTotals[year].spese += row.original.amount || 0;
        });
    });

    // ╔════════════════════════════════════════════════════╗
    // ║  Render tabella                                   ║
    // ╚════════════════════════════════════════════════════╝
    return (
        <div className="table-container overflow-x-auto">
            <table className="table-base min-w-full">
                {/* ═════ Intestazione tabella ═════ */}
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="table-header-row">
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
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
                {/* ═════ Corpo tabella, divider anno/mese e righe dati ═════ */}
                <tbody>
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
                                        className="rounded-top"
                                    />
                                );
                            }

                            // Divider MESE
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

                            // Righe transazioni normali
                            rows.forEach((row, idx) => {
                                const isLast = idx === rows.length - 1;
                                blocco.push(
                                    <TableRow
                                        key={row.id}
                                        row={row}
                                        onClick={onRowClick}
                                        className={isLast ? "rounded-bottom" : ""}
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
