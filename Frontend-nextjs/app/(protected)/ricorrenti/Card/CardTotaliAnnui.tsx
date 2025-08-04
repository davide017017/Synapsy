"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ CardTotaliAnnui.tsx — Tabella riepilogo ricorrenze annue   ║
// ╚══════════════════════════════════════════════════════════════╝

import { Repeat, ArrowDown, ArrowUp } from "lucide-react";
import { aggregaRicorrenzePerTipoEFrequenza, frequenzaOrder, sommaTotaleAnnua } from "../utils/ricorrenza-utils";
import { Ricorrenza } from "@/types/models/ricorrenza";
import type { CardTotaliAnnuiProps } from "@/types/ricorrenti/card";
import NewRicorrenzaButton from "@/app/(protected)/newRicorrenza/NewRicorrenzaButton";

// ============================
// Props tipizzate
// ============================

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
// Utility colore bilancio
// ============================
function getBilancioColor(val: number) {
    if (val > 0) return "text-[hsl(var(--c-total-positive-text))] bg-[hsl(var(--c-total-positive-bg))]/80";
    if (val < 0) return "text-[hsl(var(--c-total-negative-text))] bg-[hsl(var(--c-total-negative-bg))]/80";
    return "text-[hsl(var(--c-total-neutral-text))] bg-[hsl(var(--c-total-neutral-bg))]/80";
}

// ============================
// Utility pill frequenza
// ============================
function getFreqStyle(freq: string) {
    const base = freq.toLowerCase();
    return {
        background: `hsl(var(--c-freq-${base}-bg, var(--c-freq-custom-bg)))`,
        color: `hsl(var(--c-freq-${base}-text, var(--c-freq-custom-text)))`,
        border: `1px solid hsl(var(--c-freq-${base}-border, var(--c-freq-custom-border)))`,
    };
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ COMPONENTE PRINCIPALE                                      ║
// ╚══════════════════════════════════════════════════════════════╝

export default function CardTotaliAnnui({ ricorrenze }: CardTotaliAnnuiProps) {
    // ===== Raggruppa dati =====
    const aggregato = aggregaRicorrenzePerTipoEFrequenza(ricorrenze);

    // Trova tutte le frequenze usate, ordinate
    const frequenze = Object.keys({ ...aggregato.spesa, ...aggregato.entrata })
        .filter((x, i, arr) => arr.indexOf(x) === i)
        .sort(ordinaFrequenza);

    // Totali annui
    const totaleSpeseAnnue = sommaTotaleAnnua(aggregato.spesa);
    const totaleEntrateAnnue = sommaTotaleAnnua(aggregato.entrata);
    const bilancioRicorrenti = totaleEntrateAnnue - totaleSpeseAnnue;

    // ===== Render =====
    return (
        <>
            <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex flex-col gap-3 shadow-md min-h-[180px]">
                <div>
                    <NewRicorrenzaButton />
                </div>
                {/* ---------- Titolo ---------- */}
                {/* ======================================================== */}
                {/* Intestazione Hero centrata */}
                <div className="relative flex flex-col items-center justify-center mb-4">
                    {/* Icona grande sfumata come background */}
                    <Repeat
                        className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-15 w-20 h-20 pointer-events-none"
                        style={{ filter: "blur(1px)", color: "hsl(var(--c-secondary))" }}
                        aria-hidden
                    />
                    {/* Titolo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <Repeat className="w-8 h-8 text-primary drop-shadow" />
                        <span className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight text-center text-[hsl(var(--c-primary-dark))]">
                            Riepilogo Ricorrenze Annue
                        </span>
                    </div>
                </div>
                {/* ======================================================== */}

                {/* ---------- TABELLA ---------- */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs md:text-sm text-center">
                        {/* ================= THEAD ================= */}
                        <thead>
                            <tr className="bg-[hsl(var(--c-table-header-bg))] border-b-2 border-[hsl(var(--c-table-divider))]">
                                <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-header-text))]"></th>
                                <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-header-text))]">
                                    Frequenza
                                </th>
                                <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-danger-2))] flex flex-col items-center justify-center gap-1">
                                    <ArrowDown
                                        className="mx-auto w-5 h-5"
                                        style={{
                                            color: "hsl(var(--c-table-danger-2))",
                                            opacity: 0.7,
                                        }}
                                    />
                                    <span>Spese</span>
                                </th>
                                <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-danger-2))]">Annue</th>
                                <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-success-2))] flex flex-col items-center justify-center gap-1">
                                    <ArrowUp
                                        className="mx-auto w-5 h-5"
                                        style={{
                                            color: "hsl(var(--c-table-success-2))",
                                            opacity: 0.7,
                                        }}
                                    />
                                    <span>Entrate</span>
                                </th>
                                <th className="px-2 py-2 font-medium text-[hsl(var(--c-table-success-2))]">Annue</th>
                            </tr>
                        </thead>
                        {/* ================= TBODY ================= */}
                        <tbody>
                            {frequenze.map((freq) => (
                                <tr
                                    key={freq}
                                    className="border-b border-[hsl(var(--c-table-divider))] transition hover:bg-[hsl(var(--c-table-row-hover))]/50"
                                >
                                    {/* Empty, per eventuali future icone */}
                                    <td className="px-2 py-1"></td>
                                    {/* Pill frequenza */}
                                    <td className="px-2 py-1">
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                                            style={getFreqStyle(freq)}
                                        >
                                            {freq}
                                        </span>
                                    </td>
                                    {/* Valori Spese */}
                                    <td className="px-2 py-1 font-mono text-[hsl(var(--c-table-danger-2))]">
                                        €{(aggregato.spesa[freq]?.totale ?? 0).toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 font-mono text-[hsl(var(--c-table-danger-2))]">
                                        €{(aggregato.spesa[freq]?.totaleAnnuale ?? 0).toFixed(2)}
                                    </td>
                                    {/* Valori Entrate */}
                                    <td className="px-2 py-1 font-mono text-[hsl(var(--c-table-success-2))]">
                                        €{(aggregato.entrata[freq]?.totale ?? 0).toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 font-mono text-[hsl(var(--c-table-success-2))]">
                                        €{(aggregato.entrata[freq]?.totaleAnnuale ?? 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* ================= TFOOT ================= */}
                        <tfoot>
                            <tr className="border-t-2 border-[hsl(var(--c-table-divider))]">
                                <td className="px-2 py-1 font-bold" colSpan={2}>
                                    Totale
                                </td>
                                <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-danger-2))]"></td>
                                <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-danger-2))]">
                                    €{totaleSpeseAnnue.toFixed(2)}
                                </td>
                                <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-success-2))]"></td>
                                <td className="px-2 py-1 font-bold font-mono text-[hsl(var(--c-table-success-2))]">
                                    €{totaleEntrateAnnue.toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 font-bold text-center" colSpan={6}>
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
                                        }}
                                    >
                                        Bilancio Ricorrenti Annui: {bilancioRicorrenti >= 0 ? "+" : "–"}€
                                        {Math.abs(bilancioRicorrenti).toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ END CardTotaliAnnui.tsx                                    ║
// ╚══════════════════════════════════════════════════════════════╝

