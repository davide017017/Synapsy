import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { ColumnDef, Row } from "@tanstack/react-table";
import { TransactionWithGroup } from "./types";

// ============================
// Definizione colonne per TanStack Table (size/minSize ottimizzati)
// ============================
export const columns: ColumnDef<TransactionWithGroup, any>[] = [
    // Data
    {
        accessorKey: "date",
        header: "Data",
        size: 64,
        minSize: 48,
        maxSize: 72,
        cell: ({ getValue }) => (
            <span className="text-xs text-table-text-secondary">
                {new Date(getValue() as string).toLocaleDateString("it-IT")}
            </span>
        ),
    },
    // Icona
    {
        id: "icon",
        header: "",
        size: 28,
        minSize: 28,
        maxSize: 36,
        enableResizing: false,
        cell: ({ row }: { row: Row<TransactionWithGroup> }) => {
            const type = row.original?.category?.type;
            return type === "entrata" ? (
                <ArrowDown className="text-table-success" size={16} />
            ) : (
                <ArrowUp className="text-table-danger" size={16} />
            );
        },
    },
    // Importo
    {
        accessorKey: "amount",
        header: "Importo",
        size: 68,
        minSize: 60,
        maxSize: 80,
        cell: ({ getValue, row }) => {
            const value = getValue() as number;
            const type = row.original?.category?.type;
            return (
                <span
                    className={clsx(
                        "font-mono font-semibold",
                        type === "entrata" ? "text-table-success" : "text-table-danger"
                    )}
                >
                    {type === "entrata" ? "+" : "-"}
                    {value?.toFixed(2)} €
                </span>
            );
        },
    },
    // Descrizione
    {
        accessorKey: "description",
        header: "Descrizione",
        size: 320,
        minSize: 160,
        cell: ({ getValue }) => <span className="truncate text-table-text">{getValue() as string}</span>,
    },
    // Categoria
    {
        id: "category",
        header: "Categoria",
        size: 100,
        minSize: 70,
        maxSize: 140,
        cell: ({ row }) =>
            row.original?.category ? (
                <span
                    className={clsx(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        row.original.category.type === "entrata"
                            ? "text-table-success border-[hsl(var(--c-success)/0.42)]"
                            : "text-table-danger border-[hsl(var(--c-danger)/0.42)]"
                    )}
                    style={{
                        background: "hsl(var(--c-primary) / 0.08)",
                        borderWidth: 1,
                    }}
                >
                    {row.original.category.name}
                </span>
            ) : null,
    },
];
