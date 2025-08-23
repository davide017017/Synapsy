// ╔══════════════════════════════════════════════════════╗
// ║   TableRow.tsx — Riga singola tabella transazioni   ║
// ╚══════════════════════════════════════════════════════╝

import { Row, flexRender } from "@tanstack/react-table";
import type { TransactionWithGroup, TableRowProps } from "@/types/transazioni/list";
import clsx from "clsx";
import { useSelection } from "@/context/SelectionContext";

export default function TableRow({ row, onClick, className }: TableRowProps) {
    const { isSelectionMode, selectedIds } = useSelection();
    const isChecked = selectedIds.includes(row.original.id);

    return (
        <tr
            key={row.id}
            className={clsx(
                className,
                // Riga selezionata: verde soft traslucido, bordo menta
                isChecked
                    ? "bg-[hsl(var(--c-table-row-selected))] border-l-4 border-[hsl(var(--c-primary))] shadow-inner"
                    : "hover:bg-[hsl(var(--c-table-row-hover))] cursor-pointer transition-colors",
                "border-b border-[hsl(var(--c-table-divider))]"
            )}
            // Clic solo se non in modalità selezione multipla
            onClick={() => !isSelectionMode && onClick?.(row.original)}
            tabIndex={0}
        >
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-2 align-middle text-[hsl(var(--c-table-text))]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
}

