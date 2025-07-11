// ============================
// columns.tsx
// Definizione colonne per TanStack Table (con factory per checkbox)
// ============================

import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { ColumnDef, Row } from "@tanstack/react-table";
import { TransactionWithGroup } from "./types";

// ============================
// Factory: colonne con selezione multipla
// ============================

/**
 * Restituisce le colonne per la tabella transazioni.
 * Accetta stato selezione multipla per collegare la checkbox alla UI.
 */
export function getColumnsWithSelection(
    isSelectionMode: boolean,
    selectedIds: number[],
    onCheckToggle: (id: number) => void,
    onCheckAllToggle?: (checked: boolean) => void, // funzione opzionale per "seleziona tutto"
    allIds: number[] = [] // array con tutti gli id delle righe visibili
): ColumnDef<TransactionWithGroup, any>[] {
    return [
        // ════════════════════════════════════════
        // Colonna: Checkbox selezione multipla
        // ════════════════════════════════════════
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
                                      // Imposta indeterminate solo quando almeno uno ma non tutti sono selezionati
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

        // ════════════════════════════════════════
        // Colonna: Data
        // ════════════════════════════════════════
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

        // ════════════════════════════════════════
        // Colonna: Icona tipo (entrata/uscita)
        // ════════════════════════════════════════
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

        // ════════════════════════════════════════
        // Colonna: Importo
        // ════════════════════════════════════════
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

        // ════════════════════════════════════════
        // Colonna: Descrizione
        // ════════════════════════════════════════
        {
            accessorKey: "description",
            header: "Descrizione",
            size: 320,
            minSize: 160,
            cell: ({ getValue }) => <span className="truncate text-table-text">{getValue() as string}</span>,
        },

        // ════════════════════════════════════════
        // Colonna: Categoria
        // ════════════════════════════════════════
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
}

// ============================
// Esporta anche colonne base (senza selezione multipla)
// ============================
export const baseColumns: ColumnDef<TransactionWithGroup, any>[] = getColumnsWithSelection(false, [], () => {});
