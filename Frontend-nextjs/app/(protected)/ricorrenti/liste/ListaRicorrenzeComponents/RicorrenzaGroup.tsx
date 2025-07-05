// =======================================================
// RicorrenzaGroup.tsx
// Gruppo di ricorrenze per una frequenza (header + lista)
// =======================================================

import RicorrenzaItem from "./RicorrenzaItem";
import { FREQUENZE_LABEL } from "../ListaRicorrenzePerFrequenza";
import { Ricorrenza } from "@/types/types/ricorrenza";

// ============================
// Props tipizzate
// ============================
type Props = {
    freq: string;
    items: Ricorrenza[];
    showSeparator?: boolean;
    onEdit?: (r: Ricorrenza) => void;
    onDelete?: (r: Ricorrenza) => void;
};

// =======================================================
// COMPONENTE: Gruppo per frequenza
// =======================================================
export default function RicorrenzaGroup({ freq, items, showSeparator, onEdit, onDelete }: Props) {
    return (
        <li className="mb-2">
            {/* ------ Separatore visivo tra gruppi ------ */}
            {showSeparator && <div className="my-2 border-t border-dashed border-zinc-400/30" />}

            {/* ------ Intestazione gruppo ------ */}
            <div className="flex items-center gap-2 mt-3 mb-1">
                <span className="px-2 py-1 bg-bg-elevate/90 rounded text-xs font-semibold text-zinc-600 dark:text-zinc-300 tracking-wider border border-zinc-300/40">
                    {FREQUENZE_LABEL[freq] || freq}
                </span>
                <span className="text-zinc-400 text-xs">
                    {items.length} ricorrenza{items.length !== 1 && "e"}
                </span>
            </div>
            {/* ------ Lista delle ricorrenze ------ */}
            <ul>
                {items.map((r) => (
                    <RicorrenzaItem key={r.id} r={r} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
        </li>
    );
}

// ============================
// END RicorrenzaGroup.tsx
// ============================
