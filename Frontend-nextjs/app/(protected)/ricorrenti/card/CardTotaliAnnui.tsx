"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ CardTotaliAnnui.tsx — Riepilogo ricorrenze mese + anno      ║
// ╚══════════════════════════════════════════════════════════════╝

import { Repeat, ArrowDown, ArrowUp } from "lucide-react";
import { aggregaRicorrenzePerTipoEFrequenza, frequenzaOrder, sommaTotaleAnnua } from "../utils/ricorrenza-utils";
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

function bilancioClass(val: number) {
    if (val > 0) return "text-[hsl(var(--c-total-positive-text))] bg-[hsl(var(--c-total-positive-bg))]/80";
    if (val < 0) return "text-[hsl(var(--c-total-negative-text))] bg-[hsl(var(--c-total-negative-bg))]/80";
    return "text-[hsl(var(--c-total-neutral-text))] bg-[hsl(var(--c-total-neutral-bg))]/80";
}

// ── componente ───────────────────────────────────────────────

export default function CardTotaliAnnui({ ricorrenze }: CardTotaliAnnuiProps) {
    const aggregato = aggregaRicorrenzePerTipoEFrequenza(ricorrenze);

    const frequenze = Object.keys({ ...aggregato.spesa, ...aggregato.entrata })
        .filter((x, i, arr) => arr.indexOf(x) === i)
        .sort(
            (a, b) =>
                (frequenzaOrder[a as keyof typeof frequenzaOrder] ?? 99) -
                (frequenzaOrder[b as keyof typeof frequenzaOrder] ?? 99),
        );

    const totaleSpeseAnnue = sommaTotaleAnnua(aggregato.spesa);
    const totaleEntrateAnnue = sommaTotaleAnnua(aggregato.entrata);
    const totaleSpeseMensili = totaleSpeseAnnue / 12;
    const totaleEntrateMensili = totaleEntrateAnnue / 12;
    const bilancioAnnuo = totaleEntrateAnnue - totaleSpeseAnnue;
    const bilancioMensile = bilancioAnnuo / 12;

    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-1 flex flex-col gap-3 shadow-md">
            {/* Header */}
            <div className="flex items-center gap-2 justify-center">
                <Repeat className="w-5 h-5 text-primary" />
                <span className="text-base font-bold text-[hsl(var(--c-primary-dark))]">Riepilogo Ricorrenti</span>
            </div>

            {/* Riga per frequenza */}
            <div className="space-y-2">
                {frequenze.map((freq) => {
                    const f = normFreq(freq);
                    const speseAnnue = aggregato.spesa[freq]?.totaleAnnuale ?? 0;
                    const entrateAnnue = aggregato.entrata[freq]?.totaleAnnuale ?? 0;
                    const speseMensili = speseAnnue / 12;
                    const entrateMensili = entrateAnnue / 12;
                    const saldoAnnuo = entrateAnnue - speseAnnue;

                    return (
                        <div
                            key={freq}
                            className="rounded-xl border border-[hsl(var(--c-table-divider))] bg-[hsl(var(--c-bg-elevate))]/40 px-3 py-2"
                        >
                            {/* Pill + saldo annuo */}
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={getFreqStyle(f)}>
                                    {FREQ_LABEL[f] ?? freq}
                                </span>
                                <span className={`text-xs tabular-nums font-semibold ${saldoClass(saldoAnnuo)}`}>
                                    {saldoAnnuo >= 0 ? "+" : "–"}
                                    {eur(Math.abs(saldoAnnuo))}
                                    <span className="opacity-50 ml-1 font-normal">/anno</span>
                                </span>
                            </div>

                            {/* Spese / Entrate: /mese e /anno */}
                            <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
                                {/* Spese */}
                                <div className="px-2 py-1 rounded-lg border border-[hsl(var(--c-table-divider))] bg-black/10">
                                    <div className="flex items-center gap-1 text-[hsl(var(--c-table-danger-2))] font-semibold mb-0.5">
                                        <ArrowDown className="w-3 h-3 opacity-70" />
                                        Spese
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-50">/mese</span>
                                        <span className="font-mono text-[hsl(var(--c-table-danger-2))]">
                                            {eur(speseMensili)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-50">/anno</span>
                                        <span className="font-mono text-[hsl(var(--c-table-danger-2))]">
                                            {eur(speseAnnue)}
                                        </span>
                                    </div>
                                </div>

                                {/* Entrate */}
                                <div className="px-2 py-1 rounded-lg border border-[hsl(var(--c-table-divider))] bg-black/10">
                                    <div className="flex items-center gap-1 text-[hsl(var(--c-table-success-2))] font-semibold mb-0.5">
                                        <ArrowUp className="w-3 h-3 opacity-70" />
                                        Entrate
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-50">/mese</span>
                                        <span className="font-mono text-[hsl(var(--c-table-success-2))]">
                                            {eur(entrateMensili)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-50">/anno</span>
                                        <span className="font-mono text-[hsl(var(--c-table-success-2))]">
                                            {eur(entrateAnnue)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer totali + bilancio */}
            <div className="rounded-xl border border-[hsl(var(--c-table-divider))] bg-[hsl(var(--c-bg-elevate))]/40 px-3 py-2 space-y-1.5">
                {/* Totali spese */}
                <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-3 text-xs tabular-nums">
                    <span className="font-bold text-[hsl(var(--c-table-danger-2))] flex items-center gap-1">
                        <ArrowDown className="w-3 h-3 opacity-70" />
                        Spese
                    </span>
                    <span className="text-right font-mono text-[hsl(var(--c-table-danger-2))]">
                        {eur(totaleSpeseMensili)}
                        <span className="opacity-50 ml-0.5">/mese</span>
                    </span>
                    <span className="text-right font-mono text-[hsl(var(--c-table-danger-2))]">
                        {eur(totaleSpeseAnnue)}
                        <span className="opacity-50 ml-0.5">/anno</span>
                    </span>
                </div>

                {/* Totali entrate */}
                <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-3 text-xs tabular-nums">
                    <span className="font-bold text-[hsl(var(--c-table-success-2))] flex items-center gap-1">
                        <ArrowUp className="w-3 h-3 opacity-70" />
                        Entrate
                    </span>
                    <span className="text-right font-mono text-[hsl(var(--c-table-success-2))]">
                        {eur(totaleEntrateMensili)}
                        <span className="opacity-50 ml-0.5">/mese</span>
                    </span>
                    <span className="text-right font-mono text-[hsl(var(--c-table-success-2))]">
                        {eur(totaleEntrateAnnue)}
                        <span className="opacity-50 ml-0.5">/anno</span>
                    </span>
                </div>

                {/* Bilancio: due pill affiancate */}
                <div className="flex gap-2 justify-center pt-1 flex-wrap">
                    <span
                        className={`text-sm font-bold px-3 py-1 rounded-xl border shadow-sm ${bilancioClass(bilancioMensile)}`}
                        style={{ borderColor: "hsl(var(--c-total-positive-border))" }}
                    >
                        {bilancioMensile >= 0 ? "+" : "–"}
                        {eur(Math.abs(bilancioMensile))}
                        <span className="opacity-70 ml-1 font-normal">/mese</span>
                    </span>
                    <span
                        className={`text-sm font-bold px-3 py-1 rounded-xl border shadow-sm ${bilancioClass(bilancioAnnuo)}`}
                        style={{ borderColor: "hsl(var(--c-total-positive-border))" }}
                    >
                        {bilancioAnnuo >= 0 ? "+" : "–"}
                        {eur(Math.abs(bilancioAnnuo))}
                        <span className="opacity-70 ml-1 font-normal">/anno</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
