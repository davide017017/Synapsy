"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ CardTotaliAnnui.tsx — Barra riepilogo mese + anno           ║
// ║ Chiusa: MENSILE | SPESE | ENTRATE | ANNO                    ║
// ║ Tap → dettaglio per frequenza (spese/entrate mese+anno,     ║
// ║       saldo annuo) + riga totale                            ║
// ╚══════════════════════════════════════════════════════════════╝

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { frequenzaOrder, riepilogoTotali } from "../utils/ricorrenza-utils";
import type { CardTotaliAnnuiProps } from "@/types/ricorrenti/card";
import { eur } from "@/utils/formatCurrency";

// ── helpers ──────────────────────────────────────────────────

function normFreq(freq: string) {
    const f = String(freq ?? "")
        .toLowerCase()
        .trim();
    if (f === "giornaliera" || f === "giornaliero") return "daily";
    if (f === "settimanale") return "weekly";
    if (f === "mensile") return "monthly";
    if (f === "annuale") return "annually";
    if (f === "annual") return "annually";
    return f;
}

const FREQ_LABEL: Record<string, string> = {
    daily: "Giornaliera",
    weekly: "Settimanale",
    monthly: "Mensile",
    annually: "Annuale",
};

function getFreqStyle(freq: string) {
    const base = normFreq(freq);
    return {
        background: `hsl(var(--c-freq-${base}-bg, var(--c-freq-custom-bg)))`,
        color: `hsl(var(--c-freq-${base}-text, var(--c-freq-custom-text)))`,
        border: `1px solid hsl(var(--c-freq-${base}-border, var(--c-freq-custom-border)))`,
    };
}

function saldoClass(val: number) {
    if (val > 0) return "text-[hsl(var(--c-success))]";
    if (val < 0) return "text-[hsl(var(--c-danger))]";
    return "text-muted-foreground";
}

function firmato(val: number) {
    return `${val >= 0 ? "+" : "–"}${eur(Math.abs(val))}`;
}

const SPESE = "text-[hsl(var(--c-table-danger-2))]";
const ENTRATE = "text-[hsl(var(--c-table-success-2))]";

// Cella barra: label piccola sopra, valore sotto
function Cella({ label, value, className }: { label: string; value: number; className: string }) {
    return (
        <div className="min-w-0 border-l border-primary/15 pl-2">
            <div className="text-[8px] uppercase tracking-[0.12em] text-foreground/45">{label}</div>
            <div className={`truncate text-[11px] font-bold tabular-nums ${className}`}>{eur(value)}</div>
        </div>
    );
}

// Cella dettaglio: /mese sopra, /anno sotto (unità nell'header colonna)
function MeseAnno({ mese, anno, className }: { mese: number; anno: number; className: string }) {
    return (
        <div className={`min-w-0 text-right tabular-nums leading-tight ${className}`}>
            <div className="truncate">{eur(mese)}</div>
            <div className="truncate opacity-70">{eur(anno)}</div>
        </div>
    );
}

// ── componente ───────────────────────────────────────────────

export default function CardTotaliAnnui({ ricorrenze }: CardTotaliAnnuiProps) {
    const [aperto, setAperto] = useState(false);
    const { aggregato, speseAnnue, entrateAnnue, speseMensili, entrateMensili, bilancioAnnuo } =
        riepilogoTotali(ricorrenze);

    const frequenze = Object.keys({ ...aggregato.spesa, ...aggregato.entrata }).sort(
        (a, b) =>
            (frequenzaOrder[a as keyof typeof frequenzaOrder] ?? 99) -
            (frequenzaOrder[b as keyof typeof frequenzaOrder] ?? 99),
    );

    const griglia = "grid grid-cols-[4.5rem_1fr_1fr_1fr] items-center gap-x-2";

    return (
        <div className="rounded-xl border border-primary/20 bg-black/45 font-mono backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
            {/* Barra */}
            <button
                type="button"
                onClick={() => setAperto((a) => !a)}
                aria-expanded={aperto}
                aria-controls="riepilogo-dettaglio"
                className="grid w-full grid-cols-[auto_1fr_1fr_1fr] items-center gap-x-2 px-2.5 py-1.5 text-left"
            >
                <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    Mensile
                    <ChevronDown size={12} className={`transition-transform ${aperto ? "rotate-180" : ""}`} />
                </span>
                <Cella label="Spese" value={speseMensili} className={SPESE} />
                <Cella label="Entrate" value={entrateMensili} className={ENTRATE} />
                <Cella label="Anno" value={speseAnnue} className={SPESE} />
            </button>

            {/* Dettaglio per frequenza */}
            {aperto && (
                <div id="riepilogo-dettaglio" className="border-t border-primary/15 px-2.5 py-1.5 text-[10px]">
                    <div className={`${griglia} pb-1 text-[8px] uppercase tracking-[0.12em] text-foreground/45`}>
                        <span>Freq.</span>
                        <span className="text-right">Spese /m · /a</span>
                        <span className="text-right">Entrate /m · /a</span>
                        <span className="text-right">Saldo /a</span>
                    </div>

                    {frequenze.map((freq) => {
                        const speseA = aggregato.spesa[freq]?.totaleAnnuale ?? 0;
                        const entrateA = aggregato.entrata[freq]?.totaleAnnuale ?? 0;
                        const saldoA = entrateA - speseA;
                        const f = normFreq(freq);

                        return (
                            <div key={freq} className={`${griglia} border-t border-white/5 py-1`}>
                                <span
                                    className="truncate rounded-md px-1 py-0.5 text-center text-[8px] font-bold uppercase tracking-[0.06em]"
                                    style={getFreqStyle(f)}
                                >
                                    {FREQ_LABEL[f] ?? freq}
                                </span>
                                <MeseAnno mese={speseA / 12} anno={speseA} className={SPESE} />
                                <MeseAnno mese={entrateA / 12} anno={entrateA} className={ENTRATE} />
                                <span className={`text-right font-semibold tabular-nums ${saldoClass(saldoA)}`}>
                                    {firmato(saldoA)}
                                </span>
                            </div>
                        );
                    })}

                    {/* Totale */}
                    <div className={`${griglia} border-t border-primary/20 pt-1 font-bold`}>
                        <span className="text-[9px] uppercase tracking-[0.12em] text-primary">Totale</span>
                        <MeseAnno mese={speseMensili} anno={speseAnnue} className={SPESE} />
                        <MeseAnno mese={entrateMensili} anno={entrateAnnue} className={ENTRATE} />
                        <span className={`text-right tabular-nums ${saldoClass(bilancioAnnuo)}`}>
                            {firmato(bilancioAnnuo)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
