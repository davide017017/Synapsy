// ╔══════════════════════════════════════════════════════╗
// ║   TableRow.tsx — Riga singola tabella transazioni   ║
// ╚══════════════════════════════════════════════════════╝

import { flexRender } from "@tanstack/react-table";
import type { TableRowProps } from "@/types/transazioni/list";
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
                // ✅ forza rimozione bordi (override CSS table-base)
                "!border-b-0",
                // Riga selezionata: verde soft traslucido, bordo menta
                isChecked
                    ? "bg-[hsl(var(--c-table-row-selected))] border-l-4 border-[hsl(var(--c-primary))] shadow-inner"
                    : "hover:bg-[hsl(var(--c-table-row-hover))] cursor-pointer transition-colors"
            )}
            onClick={() => !isSelectionMode && onClick?.(row.original)}
            tabIndex={0}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    // ✅ forza rimozione bordi sulle celle
                    className="px-2 py-2 align-middle text-[hsl(var(--c-table-text))] !border-b-0"
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
}

/*
File: TableRow.tsx
Scopo: renderizza una riga della tabella transazioni con hover/selection e click.
Come:
- Usa TanStack (row.getVisibleCells) e flexRender per le celle.
- Se selection mode: evidenzia riga selezionata e non esegue onClick.
- ✅ Forza !border-b-0 su tr/td per override di eventuali regole globali (.table-base).
*/
