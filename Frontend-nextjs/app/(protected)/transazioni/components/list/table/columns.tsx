// ╔══════════════════════════════════════════════════════╗
// ║ columns.tsx — Definizione colonne Tabella           ║
// ╚══════════════════════════════════════════════════════╝

import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { ColumnDef, Row } from "@tanstack/react-table";
import { TransactionWithGroup } from "./types";
import { hexToHSL } from "./utils"; // Importa la funzione dal tuo utils

// ============================
// Factory: colonne con selezione multipla
// ============================
export function getColumnsWithSelection(
    isSelectionMode: boolean,
    selectedIds: number[],
    onCheckToggle: (id: number) => void,
    onCheckAllToggle?: (checked: boolean) => void,
    allIds: number[] = []
): ColumnDef<TransactionWithGroup, any>[] {
    return [
        // Checkbox selezione multipla
        {
            id: "select",
            header: isSelectionMode
                ? function CheckboxHeader() {
                      return (
                          <input
                              type="checkbox"
                              checked={allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))}
                              ref={(input) => {
                                  if (input) {
                                      input.indeterminate =
                                          allIds.length > 0 &&
                                          selectedIds.length > 0 &&
                                          selectedIds.length < allIds.length;
                                  }
                              }}
                              onChange={(e) => onCheckAllToggle?.(e.target.checked)}
                              className="mx-auto"
                          />
                      );
                  }
                : () => <span className="block w-4 h-4 opacity-0 pointer-events-none" />,
            size: 32,
            cell: ({ row }) =>
                isSelectionMode ? (
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(row.original.id)}
                        onChange={() => onCheckToggle(row.original.id)}
                        className="mx-auto"
                    />
                ) : (
                    <span className="block w-4 h-4 opacity-0 pointer-events-none" />
                ),
            enableResizing: false,
        },

        // Data
        {
            accessorKey: "date",
            header: "Data",
            size: 64,
            minSize: 48,
            maxSize: 72,
            cell: ({ getValue }) => (
                <span className="text-xs text-[hsl(var(--c-table-text-secondary))]">
                    {new Date(getValue() as string).toLocaleDateString("it-IT")}
                </span>
            ),
        },

        // Icona tipo (entrata/spesa)
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
                    <ArrowDown className="text-[hsl(var(--c-table-success-2))]" size={16} />
                ) : (
                    <ArrowUp className="text-[hsl(var(--c-table-danger-2))]" size={16} />
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
                            type === "entrata"
                                ? "text-[hsl(var(--c-table-success-2))]"
                                : "text-[hsl(var(--c-table-danger-2))]"
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
            cell: ({ getValue }) => (
                <span className="truncate text-[hsl(var(--c-table-text))]">{getValue() as string}</span>
            ),
        },

        // Categoria
        {
            id: "category",
            header: "Categoria",
            size: 100,
            minSize: 70,
            maxSize: 140,
            cell: ({ row }) => {
                const cat = row.original?.category;
                if (!cat) return null;

                // Usa hexToHSL se è HEX, altrimenti usa già HSL
                const hsl = cat.color?.startsWith("#") ? hexToHSL(cat.color) : cat.color;

                return (
                    <span
                        className="
                            px-2 py-0.5 rounded-full font-semibold text-xs
                            border shadow-sm
                            transition
                        "
                        style={{
                            background: `hsl(${hsl} / 0.12)`, // Sfondo soft opaco
                            color: `hsl(${hsl})`, // Testo
                            borderColor: `hsl(${hsl})`, // Bordo
                            borderWidth: 1.2,
                            letterSpacing: "0.01em",
                        }}
                    >
                        {cat.icon && (
                            <span className="mr-1">
                                <i className={cat.icon}></i>
                            </span>
                        )}
                        {cat.name}
                    </span>
                );
            },
        },
    ];
}

// ============================
// Esporta colonne base (senza selezione multipla)
// ============================
export const baseColumns: ColumnDef<TransactionWithGroup, any>[] = getColumnsWithSelection(false, [], () => {});
