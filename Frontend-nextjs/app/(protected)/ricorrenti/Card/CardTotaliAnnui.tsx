"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ CardTotaliAnnui.tsx — Tabella riepilogo ricorrenze annue     ║
// ╚══════════════════════════════════════════════════════════════╝

import { Repeat, ArrowDown, ArrowUp } from "lucide-react";
import { aggregaRicorrenzePerTipoEFrequenza, frequenzaOrder, sommaTotaleAnnua } from "../utils/ricorrenza-utils";
import type { CardTotaliAnnuiProps } from "@/types/ricorrenti/card";
import NewRicorrenzaButton from "@/app/(protected)/newRicorrenza/NewRicorrenzaButton";
import { eur } from "@/utils/formatCurrency";

// ============================
// Ordina frequenze
// ============================
function ordinaFrequenza(a: string, b: string) {
    return (
        (frequenzaOrder[a as keyof typeof frequenzaOrder] ?? 99) -
        (frequenzaOrder[b as keyof typeof frequenzaOrder] ?? 99)
    );
}

// ============================
// Utility colore bilancio (pill grande in fondo)
// ============================
function getBilancioColor(val: number) {
    if (val > 0) return "text-[hsl(var(--c-total-positive-text))] bg-[hsl(var(--c-total-positive-bg))]/80";
    if (val < 0) return "text-[hsl(var(--c-total-negative-text))] bg-[hsl(var(--c-total-negative-bg))]/80";
    return "text-[hsl(var(--c-total-neutral-text))] bg-[hsl(var(--c-total-neutral-bg))]/80";
}

// ============================
// Utility colore saldo (testo)
// ============================
function getSaldoTextClass(val: number) {
    if (val > 0) return "text-[hsl(var(--c-success))]";
    if (val < 0) return "text-[hsl(var(--c-danger))]";
    return "text-muted-foreground";
}

// ============================
// Normalizza frequenza (IT/EN -> EN canonical)
// ============================
function normFreq(freq: string) {
    const f = String(freq ?? "")
        .toLowerCase()
        .trim();

    // IT -> EN canonical
    if (f === "giornaliera" || f === "giornaliero") return "daily";
    if (f === "settimanale") return "weekly";
    if (f === "mensile") return "monthly";
    if (f === "annuale") return "annually";

    // alias EN
    if (f === "annual") return "annually";

    return f;
}

// ============================
// Utility pill frequenza
// ============================
function getFreqStyle(freq: string) {
    const base = normFreq(freq);
    return {
        background: `hsl(var(--c-freq-${base}-bg, var(--c-freq-custom-bg)))`,
        color: `hsl(var(--c-freq-${base}-text, var(--c-freq-custom-text)))`,
        border: `1px solid hsl(var(--c-freq-${base}-border, var(--c-freq-custom-border)))`,
    };
}

// ============================
// Helper: label "Annue" solo se NON annually
// ============================
function annueLabelFor(freq: string) {
    return normFreq(freq) === "annually" ? "" : "Annue";
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ COMPONENTE PRINCIPALE                                      ║
// ╚══════════════════════════════════════════════════════════════╝

export default function CardTotaliAnnui({ ricorrenze }: CardTotaliAnnuiProps) {
    const aggregato = aggregaRicorrenzePerTipoEFrequenza(ricorrenze);

    const frequenze = Object.keys({ ...aggregato.spesa, ...aggregato.entrata })
        .filter((x, i, arr) => arr.indexOf(x) === i)
        .sort(ordinaFrequenza);

    const totaleSpeseAnnue = sommaTotaleAnnua(aggregato.spesa);
    const totaleEntrateAnnue = sommaTotaleAnnua(aggregato.entrata);
    const bilancioRicorrenti = totaleEntrateAnnue - totaleSpeseAnnue;

    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex flex-col gap-3 shadow-md min-h-[180px]">
            <div>
                <NewRicorrenzaButton />
            </div>

            {/* ======================================================== */}
            {/* Intestazione Hero centrata */}
            <div className="relative flex flex-col items-center justify-center mb-4">
                <Repeat
                    className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-15 w-20 h-20 pointer-events-none"
                    style={{ filter: "blur(1px)", color: "hsl(var(--c-secondary))" }}
                    aria-hidden
                />
                <div className="relative z-10 flex items-center gap-3">
                    <Repeat className="w-8 h-8 text-primary drop-shadow" />
                    <span className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight text-center text-[hsl(var(--c-primary-dark))]">
                        Riepilogo Ricorrenze Annue
                    </span>
                </div>
            </div>
            {/* ======================================================== */}

            {/* ========================================================
               MOBILE (<md): STACKED (nessun overflow, info complete)
               ======================================================== */}
            <div className="md:hidden space-y-2">
                {frequenze.map((freq) => {
                    const f = normFreq(freq);

                    const spese = aggregato.spesa[freq]?.totale ?? 0;
                    const speseAnnue = aggregato.spesa[freq]?.totaleAnnuale ?? 0;
                    const entrate = aggregato.entrata[freq]?.totale ?? 0;
                    const entrateAnnue = aggregato.entrata[freq]?.totaleAnnuale ?? 0;

                    const saldoFreq = entrateAnnue - speseAnnue;
                    const showAnnue = f !== "annually";

                    return (
                        <div
                            key={freq}
                            className="rounded-xl border border-[hsl(var(--c-table-divider))] bg-[hsl(var(--c-bg-elevate))]/40 px-3 py-2"
                        >
                            {/* header riga */}
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className="px-2 py-0.5 rounded-full text-[11px] font-bold truncate max-w-[60%]"
                                    style={getFreqStyle(f)}
                                    title={freq}
                                >
                                    {freq}
                                </span>

                                {/* saldo freq colorato */}
                                <span
                                    className={`text-[11px] tabular-nums whitespace-nowrap font-semibold ${getSaldoTextClass(
                                        saldoFreq
                                    )}`}
                                    title={f === "annually" ? "Saldo (già annuale)" : "Saldo annuo frequenza"}
                                >
                                    {saldoFreq >= 0 ? "+" : "–"}
                                    {eur(Math.abs(saldoFreq))}
                                </span>
                            </div>

                            {/* 2 righe “ordinate” */}
                            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] tabular-nums">
                                {/* Spese */}
                                <div className="rounded-lg border border-[hsl(var(--c-table-divider))] bg-black/10 px-2 py-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1 text-[hsl(var(--c-table-danger-2))] font-semibold">
                                            <ArrowDown className="w-3.5 h-3.5 opacity-70" />
                                            Spese
                                        </span>
                                        <span className="font-mono text-[hsl(var(--c-table-danger-2))] whitespace-nowrap">
                                            {eur(spese)}
                                        </span>
                                    </div>

                                    {/* "Annue" solo se NON annually */}
                                    {showAnnue && (
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <span className="opacity-70">{annueLabelFor(f)}</span>
                                            <span className="font-mono text-[hsl(var(--c-table-danger-2))] whitespace-nowrap">
                                                {eur(speseAnnue)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Entrate */}
                                <div className="rounded-lg border border-[hsl(var(--c-table-divider))] bg-black/10 px-2 py-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1 text-[hsl(var(--c-table-success-2))] font-semibold">
                                            <ArrowUp className="w-3.5 h-3.5 opacity-70" />
                                            Entrate
                                        </span>
                                        <span className="font-mono text-[hsl(var(--c-table-success-2))] whitespace-nowrap">
                                            {eur(entrate)}
                                        </span>
                                    </div>

                                    {/* "Annue" solo se NON annually */}
                                    {showAnnue && (
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <span className="opacity-70">{annueLabelFor(f)}</span>
                                            <span className="font-mono text-[hsl(var(--c-table-success-2))] whitespace-nowrap">
                                                {eur(entrateAnnue)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Footer Totali mobile */}
                <div className="rounded-xl border border-[hsl(var(--c-table-divider))] bg-[hsl(var(--c-bg-elevate))]/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] tabular-nums">
                        <span className="font-bold">Totale annuo spese</span>
                        <span className="font-mono font-bold text-[hsl(var(--c-table-danger-2))] whitespace-nowrap">
                            {eur(totaleSpeseAnnue)}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-[11px] tabular-nums">
                        <span className="font-bold">Totale annuo entrate</span>
                        <span className="font-mono font-bold text-[hsl(var(--c-table-success-2))] whitespace-nowrap">
                            {eur(totaleEntrateAnnue)}
                        </span>
                    </div>

                    <div className="mt-2 text-center">
                        <span
                            className={`text-base font-bold px-3 py-1 rounded-xl border shadow-sm inline-block max-w-full ${getBilancioColor(
                                bilancioRicorrenti
                            )}`}
                            style={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "hsl(var(--c-total-positive-border))",
                            }}
                        >
                            Bilancio Ricorrenti Annui: {bilancioRicorrenti >= 0 ? "+" : "–"}
                            {eur(Math.abs(bilancioRicorrenti))}
                        </span>
                    </div>
                </div>
            </div>

            {/* ========================================================
               DESKTOP (md+): TABELLA (come ora) + no overflow
               NOTE:
               - Header resta "Annue" (è unico), ma per riga annuale mettiamo tooltip "Già annuale".
               - Pill colori: usiamo normFreq().
               ======================================================== */}
            <div className="hidden md:block max-w-full overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm text-center table-fixed">
                    <thead>
                        <tr className="bg-[hsl(var(--c-table-header-bg))] border-b-2 border-[hsl(var(--c-table-divider))]">
                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-header-text))] w-8"></th>
                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-header-text))]">Frequenza</th>

                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-danger-2))]">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <ArrowDown
                                        className="mx-auto w-5 h-5"
                                        style={{ color: "hsl(var(--c-table-danger-2))", opacity: 0.7 }}
                                    />
                                    <span>Spese</span>
                                </div>
                            </th>

                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-danger-2))] whitespace-nowrap">
                                Annue
                            </th>

                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-success-2))]">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <ArrowUp
                                        className="mx-auto w-5 h-5"
                                        style={{ color: "hsl(var(--c-table-success-2))", opacity: 0.7 }}
                                    />
                                    <span>Entrate</span>
                                </div>
                            </th>

                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-success-2))] whitespace-nowrap">
                                Annue
                            </th>

                            <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-header-text))] whitespace-nowrap">
                                Saldo
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {frequenze.map((freq) => {
                            const f = normFreq(freq);

                            const spese = aggregato.spesa[freq]?.totale ?? 0;
                            const speseAnnue = aggregato.spesa[freq]?.totaleAnnuale ?? 0;
                            const entrate = aggregato.entrata[freq]?.totale ?? 0;
                            const entrateAnnue = aggregato.entrata[freq]?.totaleAnnuale ?? 0;

                            const saldo = entrateAnnue - speseAnnue;
                            const isAnnually = f === "annually";

                            return (
                                <tr
                                    key={freq}
                                    className="border-b border-[hsl(var(--c-table-divider))] transition hover:bg-[hsl(var(--c-table-row-hover))]/50"
                                >
                                    <td className="px-2 py-1"></td>

                                    <td className="px-2 py-1">
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center justify-center max-w-full truncate"
                                            style={getFreqStyle(f)}
                                            title={freq}
                                        >
                                            {freq}
                                        </span>
                                    </td>

                                    <td className="px-2 py-1 font-mono text-[hsl(var(--c-table-danger-2))] whitespace-nowrap">
                                        {eur(spese)}
                                    </td>

                                    <td
                                        className="px-2 py-1 font-mono text-[hsl(var(--c-table-danger-2))] whitespace-nowrap"
                                        title={isAnnually ? "Già annuale" : "Totale annuo"}
                                    >
                                        {eur(speseAnnue)}
                                    </td>

                                    <td className="px-2 py-1 font-mono text-[hsl(var(--c-table-success-2))] whitespace-nowrap">
                                        {eur(entrate)}
                                    </td>

                                    <td
                                        className="px-2 py-1 font-mono text-[hsl(var(--c-table-success-2))] whitespace-nowrap"
                                        title={isAnnually ? "Già annuale" : "Totale annuo"}
                                    >
                                        {eur(entrateAnnue)}
                                    </td>

                                    <td
                                        className={`px-2 py-1 font-mono font-bold whitespace-nowrap ${getSaldoTextClass(
                                            saldo
                                        )}`}
                                        title={isAnnually ? "Saldo (già annuale)" : "Saldo annuo frequenza"}
                                    >
                                        {saldo >= 0 ? "+" : "–"}
                                        {eur(Math.abs(saldo))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                    <tfoot>
                        <tr className="border-t-2 border-[hsl(var(--c-table-divider))]">
                            <td className="px-2 py-1 font-bold" colSpan={2}>
                                Totale
                            </td>
                            <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-danger-2))]"></td>
                            <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-danger-2))] whitespace-nowrap">
                                {eur(totaleSpeseAnnue)}
                            </td>
                            <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-success-2))]"></td>
                            <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-success-2))] whitespace-nowrap">
                                {eur(totaleEntrateAnnue)}
                            </td>
                            <td
                                className={`px-2 py-1 font-bold font-mono whitespace-nowrap ${getSaldoTextClass(
                                    bilancioRicorrenti
                                )}`}
                                title="Saldo annuo totale"
                            >
                                {bilancioRicorrenti >= 0 ? "+" : "–"}
                                {eur(Math.abs(bilancioRicorrenti))}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-2 py-2 font-bold text-center" colSpan={7}>
                                <span
                                    className={`text-lg font-bold px-4 py-1 rounded-xl border shadow-sm ${getBilancioColor(
                                        bilancioRicorrenti
                                    )}`}
                                    style={{
                                        minWidth: 140,
                                        display: "inline-block",
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "hsl(var(--c-total-positive-border))",
                                        maxWidth: "100%",
                                    }}
                                >
                                    Bilancio Ricorrenti Annui: {bilancioRicorrenti >= 0 ? "+" : "–"}
                                    {eur(Math.abs(bilancioRicorrenti))}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ END CardTotaliAnnui.tsx                                    ║
// ╚══════════════════════════════════════════════════════════════╝
