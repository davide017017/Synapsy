// ============================
// TableRow.tsx — Riga tabella transazione (usa context selezione!)
// ============================

import { Row, flexRender } from "@tanstack/react-table";
import { TransactionWithGroup } from "./types";
import clsx from "clsx";
import { useSelection } from "../../../../../../context/contexts/SelectionContext";

type Props = {
    row: Row<TransactionWithGroup>;
    onClick?: (t: TransactionWithGroup) => void;
    className?: string;
};

export default function TableRow({ row, onClick, className }: Props) {
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();
    const isChecked = selectedIds.includes(row.original.id);

    return (
        <tr
            key={row.id}
            className={clsx(/* ... */)}
            onClick={() => !isSelectionMode && onClick && onClick(row.original)}
        >
            {/* NON aggiungere qui td per la checkbox! */}
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-1 py-1 border-b align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
}
