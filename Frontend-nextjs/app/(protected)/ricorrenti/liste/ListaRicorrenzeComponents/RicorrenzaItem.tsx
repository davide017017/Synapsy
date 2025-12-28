"use client";

/* =======================================================
RicorrenzaItem.tsx — Riga uniforme (responsive)
- Mobile: 2 righe + pill frequenza
- Desktop:
  - md: Data + Categoria in colonna (anti-schiacciamento)
  - lg+: 1 riga compatta (data inline + categoria a destra)
- Bordo sinistro: colore frequenza (come mobile)
======================================================= */

import type { RicorrenzaItemProps } from "@/types/ricorrenti/liste";
import { Pencil, Trash2 } from "lucide-react";
import { getFreqPill } from "../../utils/ricorrenza-utils";
import { eur } from "@/utils/formatCurrency";

// ────────────────────────────────
// Helper: tipo robusto
// ────────────────────────────────
function getRType(r: any): "entrata" | "spesa" {
    const t = String(r?.type ?? r?.tipo ?? "").toLowerCase();
    return t === "entrata" ? "entrata" : "spesa";
}

// ────────────────────────────────
// Helper: data prossima (robusto)
// ────────────────────────────────
function getRDate(r: any): string {
    return (
        String(
            r?.prossima ??
                r?.next_occurrence_date ??
                r?.nextOccurrenceDate ??
                r?.start_date ??
                r?.startDate ??
                r?.date ??
                r?.data ??
                ""
        ) || ""
    );
}

function formatDateShort(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ────────────────────────────────
// Helper: colore bordo da style frequenza
// ────────────────────────────────
function getFreqBorderColor(style?: React.CSSProperties) {
    return (style?.borderColor as string) || "rgba(255,255,255,0.15)";
}

// ────────────────────────────────
// UI: bottoni azioni (uguali al mobile)
// ────────────────────────────────
function ActionEditButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            aria-label="Modifica ricorrenza"
            title="Modifica"
        >
            <Pencil size={16} />
        </button>
    );
}

function ActionDeleteButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/15 text-red-400 transition"
            aria-label="Elimina ricorrenza"
            title="Elimina"
        >
            <Trash2 size={16} />
        </button>
    );
}

// =======================================================
// COMPONENTE
// =======================================================
export default function RicorrenzaItem({ r, onEdit, onDelete }: RicorrenzaItemProps) {
    const tipo = getRType(r as any);
    const isIncome = tipo === "entrata";

    const { label: freqLabel, style: freqStyle } = getFreqPill((r as any)?.frequenza);
    const freqBorderColor = getFreqBorderColor(freqStyle);

    const dateLabel = formatDateShort(getRDate(r as any));

    const amountNum = Number((r as any)?.importo ?? 0) || 0;
    const amountPrefix = isIncome ? "+" : "-";
    const amountColor = isIncome ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";

    const name = String((r as any)?.nome ?? "");
    const catLabel = String((r as any)?.categoria ?? "");
    const catColor = (r as any)?.category_color ? String((r as any)?.category_color) : "";

    const CategoryPill = catLabel ? (
        <span
            className="inline-flex max-w-full text-[10px] leading-none px-2 py-1 rounded-full border truncate"
            style={{
                borderColor: catColor ? `${catColor}55` : "rgba(255,255,255,0.15)",
                backgroundColor: catColor ? `${catColor}22` : "rgba(255,255,255,0.06)",
                color: catColor || "rgba(255,255,255,0.75)",
            }}
            title={catLabel}
        >
            {catLabel}
        </span>
    ) : (
        <span className="inline-flex text-[10px] leading-none px-2 py-1 rounded-full border border-white/15 text-white/55">
            Senza categoria
        </span>
    );

    return (
        <li
            className="
                rounded-xl border border-white/10
                bg-black/20
                p-1 mb-1
                transition
                hover:bg-black/25
            "
            style={{ borderLeft: `4px solid ${freqBorderColor}` }}
        >
            {/* ===================================================
               MOBILE: 2 righe + pill frequenza
               =================================================== */}
            <div className="md:hidden">
                {/* Riga 1: Nome + pill categoria */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="font-semibold text-sm break-words" title={name}>
                            {name}
                        </div>
                        {dateLabel && <div className="text-[11px] text-muted-foreground mt-0.5">{dateLabel}</div>}
                    </div>

                    {CategoryPill}
                </div>

                {/* Riga 2: freq + importo + azioni */}
                <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="shrink-0 text-[10px] leading-none px-2 py-1 rounded-full border" style={freqStyle}>
                        {freqLabel}
                    </span>

                    <div className="ml-auto font-bold text-sm tabular-nums" style={{ color: amountColor }} title={tipo}>
                        {amountPrefix}
                        {eur(amountNum)}
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                        <ActionEditButton onClick={() => onEdit?.(r)} />
                        <ActionDeleteButton onClick={() => onDelete?.(r)} />
                    </div>
                </div>
            </div>

            {/* ===================================================
               DESKTOP:
               - md: data + categoria in colonna (anti-schiacciamento)
               - lg+: data inline e categoria a destra (1 riga)
               =================================================== */}
            <div className="hidden md:flex items-center gap-3">
                {/* Nome + (md) meta sotto / (lg) meta inline */}
                <div className="min-w-0 flex-1">
                    {/* Riga nome */}
                    <div className="font-semibold text-sm truncate" title={name}>
                        {name}
                    </div>

                    {/* md: colonna (data sopra, categoria sotto) */}
                    <div className="mt-1 flex flex-col gap-1 lg:hidden">
                        {dateLabel && <div className="text-[11px] text-muted-foreground">{dateLabel}</div>}
                        {CategoryPill}
                    </div>

                    {/* lg+: inline */}
                    <div className="hidden lg:flex items-baseline gap-2 min-w-0 mt-0.5">
                        {dateLabel && (
                            <div className="text-[11px] text-muted-foreground shrink-0" title="Prossima ricorrenza">
                                {dateLabel}
                            </div>
                        )}
                    </div>
                </div>

                {/* lg+: categoria a destra */}
                <div className="hidden lg:block shrink-0 max-w-[180px]">{CategoryPill}</div>

                {/* Importo */}
                <div
                    className="
                        font-bold text-sm tabular-nums text-right whitespace-nowrap
                        flex-shrink min-w-[80px] max-w-[100px]
                      "
                    style={{ color: amountColor }}
                    title={tipo}
                >
                    {amountPrefix}
                    {eur(amountNum)}
                </div>

                {/* Azioni */}
                <div className="shrink-0 flex items-center gap-1">
                    <ActionEditButton onClick={() => onEdit?.(r)} />
                    <ActionDeleteButton onClick={() => onDelete?.(r)} />
                </div>
            </div>
        </li>
    );
}

/*
File: RicorrenzaItem.tsx
Scopo: riga ricorrenza uniforme e leggibile.
Come:
- Mobile: 2 righe con pill frequenza.
- Desktop: bordo sinistro colore frequenza; NO pill frequenza per riga.
  - md: data + categoria in colonna per evitare compressione.
  - lg+: data inline + categoria a destra (1 riga compatta).
- Importi: + verde (entrata), - rosso (spesa).
- Pill categoria: colorata con category_color.
*/
