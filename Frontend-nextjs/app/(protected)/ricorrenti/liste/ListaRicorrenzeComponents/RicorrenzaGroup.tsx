"use client";

// =======================================================
// RicorrenzaGroup.tsx — Gruppo di ricorrenze per frequenza (compatto)
// =======================================================

import RicorrenzaItem from "./RicorrenzaItem";
import { FREQUENZE_LABEL } from "../ListaRicorrenzePerFrequenza";
import { Ricorrenza } from "@/types/types/ricorrenza";
import { Calendar, Repeat, AlarmClock, Award } from "lucide-react";

// ---------- Stile badge frequenza + icona ----------
const FREQUENZE_STYLE: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    daily: {
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-700",
        icon: <AlarmClock size={13} className="opacity-80" />,
    },
    weekly: {
        bg: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-700",
        icon: <Repeat size={13} className="opacity-80" />,
    },
    monthly: {
        bg: "bg-green-50",
        border: "border-green-100",
        text: "text-green-700",
        icon: <Calendar size={13} className="opacity-80" />,
    },
    annually: {
        bg: "bg-purple-50",
        border: "border-purple-100",
        text: "text-purple-700",
        icon: <Award size={13} className="opacity-80" />,
    },
};

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
// COMPONENTE: Gruppo per frequenza (compatto)
// =======================================================
export default function RicorrenzaGroup({ freq, items, showSeparator, onEdit, onDelete }: Props) {
    const style = FREQUENZE_STYLE[freq] || FREQUENZE_STYLE["monthly"];
    return (
        <li className="mb-0.5">
            {/* --- Separatore visivo tra gruppi --- */}
            {showSeparator && <div className="my-2 border-t border-dashed border-zinc-300/60" />}

            {/* --- Header gruppo --- */}
            <div className="flex items-center gap-2 mb-1 pl-0.5">
                <span
                    className={`
                        flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border
                        ${style.bg} ${style.text} ${style.border}
                    `}
                >
                    {style.icon}
                    {FREQUENZE_LABEL[freq] || freq}
                </span>
                <span className="text-xs rounded px-2 py-0.5 bg-zinc-50 text-zinc-400 border border-zinc-100 ml-1">
                    {items.length} ricorrenz{items.length !== 1 && "e"}
                </span>
            </div>

            {/* --- Lista --- */}
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
