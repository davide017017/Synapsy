import { Row, flexRender } from "@tanstack/react-table";
import { TransactionWithGroup } from "./types";
import clsx from "clsx";
import { useSelection } from "../../../../../../context/contexts/SelectionContext";

type Props = {
    row: Row<TransactionWithGroup>;
    onClick?: (t: TransactionWithGroup) => void;
    className?: string;
    selected?: boolean;
};

export default function TableRow({ row, onClick, className }: Props) {
    const { isSelectionMode, selectedIds } = useSelection();
    const isChecked = selectedIds.includes(row.original.id);

    return (
        <tr
            key={row.id}
            // Aggiungi classi per selezione e hover
            className={clsx(
                className,
                isChecked
                    ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary" // Riga selezionata
                    : "hover:bg-bg-alt cursor-pointer transition" // Riga normale hover
            )}
            // Clic solo se non in modalità selezione multipla
            onClick={() => !isSelectionMode && onClick?.(row.original)}
            tabIndex={0}
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
