// ╔══════════════════════════════════════════════════════╗
// ║ columns.tsx — Definizione colonne Tabella           ║
// ╚══════════════════════════════════════════════════════╝

import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { ColumnDef, Row } from "@tanstack/react-table";
import { TransactionWithGroup } from "@/types/transazioni/list";
import { hexToHSL } from "./utils"; // Importa la funzione dal tuo utils
import { eur } from "@/utils/formatCurrency";

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
                    <ArrowUp className="text-[hsl(var(--c-table-success-2))]" size={16} />
                ) : (
                    <ArrowDown className="text-[hsl(var(--c-table-danger-2))]" size={16} />
                );
            },
        },

        // ───────────────────────────────────────────────────────────
        // Importo (safe): coercizione a numero + formattazione IT
        // ───────────────────────────────────────────────────────────
        {
            accessorKey: "amount",
            header: "Importo",
            size: 68,
            minSize: 60,
            maxSize: 80,
            cell: ({ getValue, row }) => {
                // ── 1) Coercizione a numero sicura
                const raw = getValue() as unknown;
                const num = typeof raw === "number" ? raw : Number(raw);
                const safe = Number.isFinite(num) ? num : 0;

                // ── 2) Segno da tipo categoria
                const type = row.original?.category?.type; // 'entrata' | 'spesa'
                const sign = type === "entrata" ? "+" : "-";

                // ── 3) Formattazione italiana in euro (valore assoluto)
                const formatted = eur(Math.abs(safe));

                // ── 4) Rendering con classi colore in base al tipo
                return (
                    <span
                        className={clsx(
                            "font-mono font-semibold",
                            type === "entrata"
                                ? "text-[hsl(var(--c-table-success-2))]"
                                : "text-[hsl(var(--c-table-danger-2))]"
                        )}
                    >
                        {sign}
                        {formatted}
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
