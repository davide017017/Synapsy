"use client";

// =======================================================
// RicorrenzaItem.tsx — Compatto, riga uniforme
// =======================================================

import { Ricorrenza } from "@/types/types/ricorrenza";
import { Pencil, Trash2 } from "lucide-react";
import { FREQUENZE_LABEL } from "./../ListaRicorrenzePerFrequenza";

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
type Props = {
    r: Ricorrenza;
    onEdit?: (r: Ricorrenza) => void;
    onDelete?: (r: Ricorrenza) => void;
};

// =======================================================
// COMPONENTE: Singola ricorrenza compatta
// =======================================================
export default function RicorrenzaItem({ r, onEdit, onDelete }: Props) {
    const { symbol, valueClass, bgClass } = getTypeStyle(r.type);

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
                {r.note && (
                    <span className="ml-1 text-[10px] text-zinc-400 font-normal italic" title={r.note}>
                        • {r.note}
                    </span>
                )}
            </div>

            {/* Categoria (col-2) */}
            <div className="col-span-2 text-zinc-500 dark:text-zinc-400 truncate" title={r.categoria}>
                {r.categoria}
            </div>

            {/* Frequenza (col-2) */}
            <div className="col-span-2 text-zinc-400 text-center">{FREQUENZE_LABEL[r.frequenza] ?? r.frequenza}</div>

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
