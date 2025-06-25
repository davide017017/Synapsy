import { Row, flexRender } from "@tanstack/react-table";
import { TransactionWithGroup } from "./types";
import clsx from "clsx";

type Props = {
    row: Row<TransactionWithGroup>;
    onClick?: (t: TransactionWithGroup) => void;
    className?: string;
    isSelected?: boolean; // opzionale
};

export default function TableRow({ row, onClick, className, isSelected }: Props) {
    return (
        <tr
            key={row.id}
            className={clsx(
                "cursor-pointer transition",
                "hover:bg-table-row-hover",
                isSelected && "bg-table-row-selected",
                className
            )}
            onClick={() => onClick && onClick(row.original)}
        >
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-1 py-1 border-b align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
}
