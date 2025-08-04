"use client";

// =======================================================
// RicorrenzaGroup.tsx — Gruppo di ricorrenze per frequenza (compatto)
// =======================================================

import RicorrenzaItem from "./RicorrenzaItem";
import { FREQUENZE_LABEL } from "../ListaRicorrenzePerFrequenza";
import { Ricorrenza } from "@/types/models/ricorrenza";
import type { RicorrenzaGroupProps } from "@/types/ricorrenti/liste";
import { Calendar, Repeat, AlarmClock, Award } from "lucide-react";
import { getFreqPill } from "../../utils/ricorrenza-utils"; // <-- importa la utility

// ============================
// Props tipizzate
// ============================

// ============================
// Icone abbinate alle frequenze (puoi estendere se aggiungi freq nuove)
// ============================
const FREQ_ICONS: Record<string, React.ReactNode> = {
    daily: <AlarmClock size={13} className="opacity-80" />,
    weekly: <Repeat size={13} className="opacity-80" />,
    monthly: <Calendar size={13} className="opacity-80" />,
    annually: <Award size={13} className="opacity-80" />,
};

// =======================================================
// COMPONENTE: Gruppo per frequenza (compatto)
// =======================================================
export default function RicorrenzaGroup({ freq, items, showSeparator, onEdit, onDelete }: RicorrenzaGroupProps) {
    // --- Colore e label pill da utility (coerente col tema) ---
    const { label, style } = getFreqPill(freq);

    // --- Icona coerente con freq ---
    const icon = FREQ_ICONS[freq] ?? <Repeat size={13} className="opacity-80" />;

    return (
        <li className="mb-0.5">
            {/* --- Separatore visivo tra gruppi --- */}
            {showSeparator && <div className="my-2 border-t border-dashed border-zinc-300/60" />}

            {/* --- Header gruppo --- */}
            <div className="flex items-center gap-2 mb-1 pl-0.5">
                <span
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border"
                    style={style}
                >
                    {icon}
                    {label}
                </span>
                <span
                    className="
                        text-xs font-semibold rounded-full px-2 py-0.5 ml-1 border shadow-sm
                        bg-[hsl(var(--c-bg-elevate))] 
                        text-[hsl(var(--c-primary))]
                        border-[hsl(var(--c-primary-border))]
                        select-none
                        transition
                    "
                >
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

