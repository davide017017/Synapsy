"use client";

// =======================================================
// ListaRicorrenzePerFrequenza.tsx — Tab "PER FREQ."
// - Header gruppo: icona + label + count | Entrate · Spese · Saldo
// - Righe dense condivise (RigaRicorrenza), data con anno
// - Ordinamento per gruppo:
//    • monthly  -> giorno del mese (asc)
//    • annually -> mese dell'anno (asc), poi giorno
//    • altro    -> data completa (asc)
//   a parità: importo desc
// =======================================================

import { useMemo } from "react";
import { Clock, CalendarDays, Calendar, Star } from "lucide-react";

import RigaRicorrenza from "./RigaRicorrenza";
import { Ricorrenza } from "@/types/models/ricorrenza";
import type { ListaRicorrenzePerFrequenzaProps } from "@/types/ricorrenti/liste";
import { freqToIt, normalizzaFrequenza } from "../utils/ricorrenza-utils";
import { eur } from "@/utils/formatCurrency";

// =======================================================
// COSTANTI
// =======================================================
const FREQUENZE_ORDER = ["daily", "weekly", "monthly", "annually"] as const;

const FREQ_ICON = {
    daily: Clock,
    weekly: CalendarDays,
    monthly: Calendar,
    annually: Star,
} as const;

// =======================================================
// HELPERS
// =======================================================
function toTimeSafe(dateStr: string): number {
    if (!dateStr) return Number.POSITIVE_INFINITY;
    const t = new Date(dateStr).getTime();
    return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

function chiaveOrdinamento(freq: string, t: number): number {
    if (!Number.isFinite(t)) return 999;
    const d = new Date(t);
    if (freq === "monthly") return d.getDate();
    if (freq === "annually") return (d.getMonth() + 1) * 100 + d.getDate();
    return t;
}

function calcGroupTotals(list: Ricorrenza[]) {
    let entrate = 0;
    let spese = 0;
    for (const r of list) {
        const amount = Number(r.importo ?? 0) || 0;
        if (r.type === "entrata") entrate += amount;
        else spese += amount;
    }
    return { entrate, spese, saldo: entrate - spese };
}

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function ListaRicorrenzePerFrequenza({ ricorrenze, onEdit, onDelete }: ListaRicorrenzePerFrequenzaProps) {
    const gruppi = useMemo(() => {
        const acc: Partial<Record<(typeof FREQUENZE_ORDER)[number], Ricorrenza[]>> = {};
        for (const r of ricorrenze) (acc[normalizzaFrequenza(r.frequenza)] ??= []).push(r);

        for (const [freq, items] of Object.entries(acc)) {
            items.sort((a, b) => {
                const ka = chiaveOrdinamento(freq, toTimeSafe(a.prossima));
                const kb = chiaveOrdinamento(freq, toTimeSafe(b.prossima));
                if (ka !== kb) return ka - kb;
                return (Number(b.importo) || 0) - (Number(a.importo) || 0);
            });
        }
        return acc;
    }, [ricorrenze]);

    const gruppiPresenti = FREQUENZE_ORDER.filter((f) => gruppi[f]?.length);

    if (gruppiPresenti.length === 0) {
        return (
            <div className="rounded-xl border border-primary/15 bg-black/20 px-3 py-6 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/40">
                Nessuna ricorrenza presente.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-primary/15 bg-black/20 backdrop-blur-sm">
            {gruppiPresenti.map((freq) => {
                const items = gruppi[freq]!;
                const totals = calcGroupTotals(items);
                const Icon = FREQ_ICON[freq];

                return (
                    <section key={freq}>
                        <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-2 border-b border-primary/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tabular-nums">
                            <h3 className="flex items-center gap-1 font-bold tracking-[0.12em] text-primary">
                                <Icon size={12} />
                                {freqToIt[freq]}
                                <span className="font-normal text-foreground/40">· {items.length}</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[hsl(var(--c-success))]">+{eur(totals.entrate)}</span>
                                <span className="text-[hsl(var(--c-danger))]">–{eur(totals.spese)}</span>
                                <span
                                    className={`font-bold ${totals.saldo >= 0 ? "text-[hsl(var(--c-success))]" : "text-[hsl(var(--c-danger))]"}`}
                                >
                                    = {eur(totals.saldo)}
                                </span>
                            </div>
                        </div>
                        <ul>
                            {items.map((r) => (
                                <RigaRicorrenza
                                    key={r.id}
                                    r={r}
                                    data={r.prossima}
                                    showYear
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}
