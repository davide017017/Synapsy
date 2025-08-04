"use client";

// =======================================================
// RicorrenzaItem.tsx — Compatto, riga uniforme
// =======================================================

import { Ricorrenza } from "@/types/models/ricorrenza";
import type { RicorrenzaItemProps } from "@/types/ricorrenti/liste";
import { Pencil, Trash2 } from "lucide-react";
import { getFreqPill } from "../../utils/ricorrenza-utils";

// --------- Utility per stile e simbolo importo ---------
function getTypeStyle(type: "entrata" | "spesa") {
    if (type === "entrata") {
        return {
            symbol: "+",
            valueClass: "text-green-700",
            bgClass: "bg-[hsl(var(--c-success-bg),_#f0fff4)] border-green-200",
        };
    } else {
        return {
            symbol: "–",
            valueClass: "text-red-700",
            bgClass: "bg-[hsl(var(--c-danger-bg),_#fff0f3)] border-red-200",
        };
    }
}

// ============================
// Props tipizzate
// ============================

// =======================================================
// COMPONENTE: Singola ricorrenza compatta
// =======================================================
export default function RicorrenzaItem({ r, onEdit, onDelete }: RicorrenzaItemProps) {
    const { symbol, valueClass, bgClass } = getTypeStyle(r.type);
    const { label, style } = getFreqPill(r.frequenza); // <--- aggiunto

    return (
        <li
            className={`
                grid grid-cols-12 items-center gap-2
                rounded-xl border p-2 mb-1 shadow-sm transition
                ${bgClass} hover:shadow-lg hover:scale-[1.01]
                text-xs
            `}
        >
            {/* Nome (col-4) */}
            <div className="col-span-4 font-semibold truncate" title={r.nome}>
                {r.nome}
                {r.notes && (
                    <span className="ml-1 text-[10px] text-zinc-400 font-normal italic" title={r.notes}>
                        • {r.notes}
                    </span>
                )}
            </div>

            {/* Categoria (col-2, come pill colorata) */}
            <div className="col-span-2 flex items-center justify-start truncate">
                {r.categoria && (
                    <span
                        title={r.categoria}
                        className={`
                            px-2 py-0.5 rounded-full font-medium text-[11px] border border-zinc-200
                            shadow-sm whitespace-nowrap
                        `}
                        style={{
                            color: r.category_color ? r.category_color : undefined,
                            borderColor: r.category_color ? r.category_color : undefined,
                            background: r.category_color
                                ? `${r.category_color}15` // Aggiunge trasparenza (es: #22c55e15)
                                : undefined,
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {r.categoria}
                    </span>
                )}
            </div>

            {/* Frequenza come pill (col-2) */}
            <div className="col-span-2 flex justify-center">
                <span className="px-2 py-0.5 rounded-full border" style={style}>
                    {label}
                </span>
            </div>

            {/* Importo (col-2) */}
            <div className={`col-span-2 font-mono text-sm font-bold text-right ${valueClass}`}>
                {symbol}€{(r.importo ?? 0).toFixed(2)}
            </div>

            {/* Azioni (col-2, centrato) */}
            <div className="col-span-2 flex gap-1 justify-center">
                <button
                    className="p-1 rounded hover:bg-primary/10 text-primary transition hover:scale-110"
                    title="Modifica"
                    onClick={() => onEdit?.(r)}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    className="p-1 rounded hover:bg-red-100 text-red-600 transition hover:scale-110"
                    title="Elimina"
                    onClick={() => onDelete?.(r)}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
}

// ============================
// END RicorrenzaItem.tsx
// ============================

