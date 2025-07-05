// =======================================================
// RicorrenzaItem.tsx
// Singolo elemento ricorrenza (riga/card)
// =======================================================

import { Ricorrenza } from "@/types/types/ricorrenza";
import { Pencil, Trash2 } from "lucide-react";
import { normalizzaFrequenza } from "../../utils/ricorrenza-utils";
import { FREQUENZE_LABEL } from "../ListaRicorrenzePerFrequenza";

// --------- Utility per stile e simbolo importo ---------
function getTypeStyle(type: "entrata" | "spesa") {
    if (type === "entrata") {
        return {
            symbol: "+",
            valueClass: "text-success",
            bgClass: "bg-success/10 border-success",
        };
    } else {
        return {
            symbol: "–",
            valueClass: "text-danger",
            bgClass: "bg-danger/10 border-danger",
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
// COMPONENTE: Singola ricorrenza
// =======================================================
export default function RicorrenzaItem({ r, onEdit, onDelete }: Props) {
    const { symbol, valueClass, bgClass } = getTypeStyle(r.type);

    return (
        <li
            className={`flex items-center justify-between rounded-lg border p-2 shadow-sm text-xs hover:shadow transition mb-1 ${bgClass}`}
        >
            {/* --- Info ricorrenza --- */}
            <div>
                <div className="font-semibold">{r.nome}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {r.categoria} • {FREQUENZE_LABEL[normalizzaFrequenza(r.frequenza)] || r.frequenza}
                </div>
                {r.note && <div className="text-[11px] text-zinc-400">{r.note}</div>}
            </div>
            {/* --- Importo + Azioni --- */}
            <div className="flex items-center gap-2 ml-2">
                <span className={`font-mono text-sm ${valueClass}`}>
                    {symbol}€{(r.importo ?? 0).toFixed(2)}
                </span>
                <button
                    className="p-1 rounded hover:bg-primary/10 text-primary transition"
                    title="Modifica"
                    onClick={() => onEdit?.(r)}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    className="p-1 rounded hover:bg-red-100 text-red-600 transition"
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
