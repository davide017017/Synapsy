"use client";

// =======================================================
// RicorrenzaGroup.tsx — Gruppo di ricorrenze per frequenza (desktop)
// Header: pill frequenza + count + Totali (Entrate/Spese/Saldo)
// =======================================================

import RicorrenzaItem from "./RicorrenzaItem";
import type { RicorrenzaGroupProps } from "@/types/ricorrenti/liste";
import { Calendar, Repeat, AlarmClock, Award } from "lucide-react";
import { getFreqPill } from "../../utils/ricorrenza-utils";
import { eur } from "@/utils/formatCurrency";

// ============================
// Icone abbinate alle frequenze
// ============================
const FREQ_ICONS: Record<string, React.ReactNode> = {
    daily: <AlarmClock size={13} className="opacity-80" />,
    weekly: <Repeat size={13} className="opacity-80" />,
    monthly: <Calendar size={13} className="opacity-80" />,
    annually: <Award size={13} className="opacity-80" />,
};

// ============================
// Helper: tipo robusto (entrata/spesa)
// ============================
function getRType(r: any): "entrata" | "spesa" {
    const t = String(r?.type ?? r?.tipo ?? r?.category?.type ?? "").toLowerCase();
    return t === "entrata" ? "entrata" : "spesa";
}

// ============================
// Helper: totali REALI gruppo
// ============================
function calcTotals(items: any[]) {
    let entrate = 0;
    let spese = 0;

    for (const r of items) {
        const tipo = getRType(r);
        const amount = Number(r?.importo ?? r?.amount ?? 0) || 0;

        if (tipo === "entrata") entrate += amount;
        else spese += amount;
    }

    return { entrate, spese, saldo: entrate - spese };
}

// =======================================================
// COMPONENTE
// =======================================================
export default function RicorrenzaGroup({ freq, items, showSeparator, onEdit, onDelete }: RicorrenzaGroupProps) {
    const { label, style } = getFreqPill(freq);
    const icon = FREQ_ICONS[freq] ?? <Repeat size={13} className="opacity-80" />;

    const totals = calcTotals(items as any[]);
    const saldoPositivo = totals.saldo >= 0;

    return (
        <li className="mb-0.5">
            {/* Separatore tra gruppi */}
            {showSeparator && <div className="my-2 border-t border-dashed border-zinc-300/60" />}

            {/* Header gruppo */}
            <div className="flex items-center justify-between gap-3 mb-1 pl-0.5">
                {/* SX: pill frequenza + count */}
                <div className="flex items-center gap-2 min-w-0">
                    <span
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border shrink-0"
                        style={style}
                    >
                        {icon}
                        {label}
                    </span>

                    <span
                        className="
                            text-xs font-semibold rounded-full px-2 py-0.5 border shadow-sm
                            bg-[hsl(var(--c-bg-elevate))]
                            text-[hsl(var(--c-primary))]
                            border-[hsl(var(--c-primary-border))]
                            select-none
                            shrink-0
                        "
                    >
                        {items.length} ricorrenz{items.length !== 1 && "e"}
                    </span>
                </div>

                {/* DX: Totali (wrap su schermi medi) */}
                <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] tabular-nums">
                    <span className="flex items-center gap-1">
                        <span className="opacity-80">Entrate:</span>
                        <span className="text-[hsl(var(--c-success))] font-semibold">+{eur(totals.entrate)}</span>
                    </span>

                    <span className="flex items-center gap-1">
                        <span className="opacity-80">Spese:</span>
                        <span className="text-[hsl(var(--c-danger))] font-semibold">-{eur(totals.spese)}</span>
                    </span>

                    <span className="flex items-center gap-1">
                        <span className="opacity-80">Saldo:</span>
                        <span
                            className={`font-bold ${
                                saldoPositivo ? "text-[hsl(var(--c-success))]" : "text-[hsl(var(--c-danger))]"
                            }`}
                        >
                            {eur(totals.saldo)}
                        </span>
                    </span>
                </div>
            </div>

            {/* Lista */}
            <ul>
                {items.map((r) => (
                    <RicorrenzaItem key={(r as any).id} r={r as any} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
        </li>
    );
}
