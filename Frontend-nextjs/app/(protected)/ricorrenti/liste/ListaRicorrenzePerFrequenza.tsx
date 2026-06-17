"use client";

// =======================================================
// ListaRicorrenzePerFrequenza.tsx — Lista completa UI soft
// Desktop (md+): gruppi (RicorrenzaGroup) = versione PC
// Mobile (<md): lista dense SUPER compatta con divider per frequenza + totali reali
// Fix inclusi:
// - Totali divider: Entrate(+ verde), Spese(- rosso), Saldo (verde/rosso)
// - Divider multi-riga (wrap) → niente overflow
// - Bordo sinistro = colore frequenza (divider + righe)
// - Pill categoria = colore categoria (robusto)
// - Importi: entrate verdi con +, spese rosse con -
// - Azioni edit/delete unificate (compact)
// - Ordinamento per gruppo:
//    • monthly  -> giorno del mese (asc)
//    • annually -> mese dell'anno (asc), poi giorno
//    • altro    -> data completa (asc)
// - Data mostrata in piccolo (usa next_occurrence_date/start_date)
// - Mobile: NIENTE pill frequenza per riga (solo bordo + divider)
// - FIX DOM: niente <button> annidati (wrapper riga = div role="button")
// =======================================================

import React, { useMemo, useState } from "react";
import { Repeat, Pencil, Trash2, ChartNoAxesCombined, Clock, CalendarDays, Calendar, Star } from "lucide-react";

import RicorrenzaGroup from "./ListaRicorrenzeComponents/RicorrenzaGroup";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import { Ricorrenza } from "@/types/models/ricorrenza";
import type { ListaRicorrenzePerFrequenzaProps } from "@/types/ricorrenti/liste";
import { eur } from "@/utils/formatCurrency";

// =======================================================
// COSTANTI
// =======================================================
export const FREQUENZE_ORDER = ["daily", "weekly", "monthly", "annually"] as const;

export const FREQUENZE_LABEL: Record<string, string> = {
    daily: "Giornaliera",
    weekly: "Settimanale",
    monthly: "Mensile",
    annually: "Annuale",
};

// =======================================================
// HELPERS — parsing
// =======================================================
function safeColor(color?: string | null, fallback = "hsl(var(--c-primary))") {
    const c = String(color ?? "").trim();
    return c ? c : fallback;
}

function getRType(r: any): "entrata" | "spesa" {
    const t = String(r?.tipo ?? r?.type ?? r?.category?.type ?? "").toLowerCase();
    if (t === "entrata" || t === "spesa") return t as any;
    return "spesa";
}

function getCategoryColor(r: any) {
    return safeColor(
        r?.categoria_colore ??
            r?.colore_categoria ??
            r?.category_color ??
            r?.categoryColor ??
            r?.color ??
            r?.categoriaColor ??
            r?.category?.color,
        "hsl(var(--c-primary))",
    );
}

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
                "",
        ) || ""
    );
}

function toTimeSafe(dateStr: string): number {
    if (!dateStr) return Number.POSITIVE_INFINITY;
    const t = new Date(dateStr).getTime();
    return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

function formatDateSmall(dateStr: string) {
    if (!dateStr) return "";
    try {
        return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
            new Date(dateStr),
        );
    } catch {
        return dateStr;
    }
}

// =======================================================
// HELPERS — totali
// =======================================================
function calcGroupTotals(list: Ricorrenza[]) {
    let entrate = 0;
    let spese = 0;

    for (const r of list) {
        const tipo = getRType(r as any);
        const amount = Number((r as any)?.importo ?? 0) || 0;

        if (tipo === "entrata") entrate += amount;
        else spese += amount;
    }

    return { entrate, spese, saldo: entrate - spese };
}

// =======================================================
// UI — icona frequenza per divider mobile
// =======================================================
function FreqIcon({ freq, size = 14 }: { freq: string; size?: number }) {
    switch (freq) {
        case "daily":
            return <Clock size={size} />;
        case "weekly":
            return <CalendarDays size={size} />;
        case "monthly":
            return <Calendar size={size} />;
        case "annually":
            return <Star size={size} />;
        default:
            return null;
    }
}

// =======================================================
// UI — meta frequenza (pill + colore bordo)
// (pillClass serve SOLO per divider, non per righe)
// =======================================================
function freqPillMeta(freq?: string) {
    switch (freq) {
        case "weekly":
            return {
                label: "Settimanale",
                pillClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                borderColor: "rgba(16,185,129,0.55)",
            };
        case "monthly":
            return {
                label: "Mensile",
                pillClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
                borderColor: "rgba(56,189,248,0.55)",
            };
        case "annually":
            return {
                label: "Annuale",
                pillClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                borderColor: "rgba(245,158,11,0.55)",
            };
        case "daily":
            return {
                label: "Giornaliera",
                pillClass: "bg-violet-500/15 text-violet-300 border-violet-500/30",
                borderColor: "rgba(139,92,246,0.55)",
            };
        default:
            return {
                label: String(freq ?? "Frequenza"),
                pillClass: "bg-white/10 text-white/70 border-white/20",
                borderColor: "rgba(255,255,255,0.18)",
            };
    }
}

// =======================================================
// UI — bottoni azioni (compact)
// - onClick riceve l’evento per stopPropagation
// =======================================================
function ActionEditButton({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                p-1.5
                rounded-xl
                border border-primary/25
                bg-primary/10
                text-primary
                transition-all duration-200
                hover:bg-primary/15
                hover:shadow-[0_0_12px_hsl(var(--c-primary)/0.20)]
                active:scale-95
            "
            aria-label="Modifica ricorrenza"
            title="Modifica"
        >
            <Pencil size={14} />
        </button>
    );
}

function ActionDeleteButton({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                p-1.5
                rounded-xl
                border border-red-400/25
                bg-red-500/10
                text-red-400/85
                transition-all duration-200
                hover:bg-red-500/15
                hover:text-red-300
                hover:shadow-[0_0_12px_rgba(248,113,113,0.22)]
                active:scale-95
            "
            aria-label="Elimina ricorrenza"
            title="Elimina"
        >
            <Trash2 size={14} />
        </button>
    );
}

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function ListaRicorrenzePerFrequenza({
    ricorrenze,
    onEdit,
    onDelete,
}: ListaRicorrenzePerFrequenzaProps) {
    const [toDelete, setToDelete] = useState<Ricorrenza | null>(null);
    const [loading, setLoading] = useState(false);

    const gruppi = useMemo(() => {
        const acc: Record<string, Ricorrenza[]> = {};

        for (const r of ricorrenze) {
            const freq = (r as any)?.frequenza;
            if (!acc[freq]) acc[freq] = [];
            acc[freq].push(r);
        }

        FREQUENZE_ORDER.forEach((freq) => {
            if (!acc[freq]) return;

            acc[freq].sort((a, b) => {
                const da = getRDate(a as any);
                const db = getRDate(b as any);

                const ta = toTimeSafe(da);
                const tb = toTimeSafe(db);

                if (freq === "monthly") {
                    const dayA = Number.isFinite(ta) ? new Date(ta).getDate() : 999;
                    const dayB = Number.isFinite(tb) ? new Date(tb).getDate() : 999;
                    if (dayA !== dayB) return dayA - dayB;
                    return (Number((b as any)?.importo) || 0) - (Number((a as any)?.importo) || 0);
                }

                if (freq === "annually") {
                    const monthA = Number.isFinite(ta) ? new Date(ta).getMonth() + 1 : 999;
                    const monthB = Number.isFinite(tb) ? new Date(tb).getMonth() + 1 : 999;
                    if (monthA !== monthB) return monthA - monthB;

                    const dayA = Number.isFinite(ta) ? new Date(ta).getDate() : 999;
                    const dayB = Number.isFinite(tb) ? new Date(tb).getDate() : 999;
                    if (dayA !== dayB) return dayA - dayB;

                    return (Number((b as any)?.importo) || 0) - (Number((a as any)?.importo) || 0);
                }

                if (ta !== tb) return ta - tb;
                return (Number((b as any)?.importo) || 0) - (Number((a as any)?.importo) || 0);
            });
        });

        return acc;
    }, [ricorrenze]);

    const gruppiPresenti = useMemo(() => FREQUENZE_ORDER.filter((f) => gruppi[f]?.length), [gruppi]);

    async function handleConfirmDelete() {
        if (!toDelete || !onDelete) return;

        setLoading(true);
        try {
            await onDelete(toDelete);
        } finally {
            setLoading(false);
            setToDelete(null);
        }
    }

    return (
        <div
            className="
                rounded-2xl
                border border-primary/20
                bg-black/45
                backdrop-blur-xl
                p-3
                shadow-[0_18px_55px_rgba(0,0,0,0.24)]
                min-h-[180px]
            "
        >
            {" "}
            <h2
                className="
                    mb-3
                    flex items-center justify-center gap-2
                    font-mono
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-primary
                    drop-shadow-[0_0_12px_hsl(var(--c-primary)/0.25)]
                "
            >
                <Repeat className="w-5 h-5 drop-shadow-[0_0_12px_hsl(var(--c-primary)/0.35)]" />
                Ricorrenti per frequenza
            </h2>
            {gruppiPresenti.length === 0 ? (
                <div
                    className="
                    px-3 py-8
                    text-center
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.12em]
                    text-foreground/40
                "
                >
                    Nessuna ricorrenza presente.
                </div>
            ) : (
                <>
                    {/* ===================================================
                      MOBILE SUPER-COMPACT (solo <md)
                       =================================================== */}
                    <div
                        className="
                        md:hidden
                        rounded-2xl
                        border border-primary/15
                        bg-black/20
                        overflow-hidden
                        backdrop-blur-sm
                    "
                    >
                        {" "}
                        {gruppiPresenti.flatMap((freq) => {
                            const items = gruppi[freq] ?? [];
                            const meta = freqPillMeta(freq);
                            const borderLeft = meta.borderColor;
                            const totals = calcGroupTotals(items);

                            const out: JSX.Element[] = [];

                            // Divider compact
                            out.push(
                                <div
                                    key={`div-${freq}`}
                                    className="
                                        px-2 py-2
                                        bg-white/5
                                        border-b border-primary/10
                                    "
                                    style={{ borderLeft: `10px solid ${borderLeft}` }}
                                >
                                    {/* Unica riga: label + totali + contatore voci */}
                                    <div
                                        className="
                                        flex flex-wrap items-center
                                        gap-x-2 gap-y-1
                                        font-mono
                                        text-[10px]
                                        uppercase
                                        tracking-[0.04em]
                                        tabular-nums
                                    "
                                    >
                                        {" "}
                                        <span className="flex items-center gap-1 text-xs font-bold text-primary shrink-0">
                                            {" "}
                                            <FreqIcon freq={freq} size={19} />
                                            {meta.label}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="opacity-80">Entrate:</span>
                                            <span className="text-[hsl(var(--c-success))] ">
                                                +{eur(totals.entrate)}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="opacity-80">Spese:</span>
                                            <span className="text-[hsl(var(--c-danger))] font-semibold">
                                                -{eur(totals.spese)}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="opacity-80">Saldo:</span>
                                            <span
                                                className={`font-bold ${
                                                    totals.saldo >= 0
                                                        ? "text-[hsl(var(--c-success))]"
                                                        : "text-[hsl(var(--c-danger))]"
                                                }`}
                                            >
                                                {eur(totals.saldo)}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1 opacity-60 ml-auto shrink-0 text-xs">
                                            {" "}
                                            <ChartNoAxesCombined size={18} />
                                            {items.length}
                                        </span>
                                    </div>
                                </div>,
                            );

                            // Righe compact (NO pill frequenza) — 1 riga (wrap se serve)
                            items.forEach((r) => {
                                const tipo = getRType(r);
                                const isIncome = tipo === "entrata";

                                const amountNum = Number((r as any)?.importo ?? 0) || 0;
                                const amountColor = isIncome ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";
                                const amountPrefix = isIncome ? "+" : "-";

                                const categoryColor = getCategoryColor(r as any);
                                const catLabel = (r as any)?.categoria ? String((r as any)?.categoria) : "";

                                const dateStr = getRDate(r as any);
                                const dateLabel = dateStr ? formatDateSmall(dateStr) : "";

                                out.push(
                                    <div
                                        key={`r-${(r as any)?.id}`}
                                        className="
                                            px-2 py-2
                                            border-b border-primary/10
                                            hover:bg-primary/5
                                            transition-colors
                                        "
                                        style={{ borderLeft: `4px solid ${borderLeft}` }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Wrapper NON-button cliccabile — 2 righe compatte */}
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => onEdit?.(r)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") onEdit?.(r);
                                                }}
                                                className="min-w-0 flex-1 flex flex-col gap-0.5 text-left cursor-pointer"
                                                title="Modifica"
                                            >
                                                {/* Riga 1: Nome + Importo */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="font-mono text-[12px] text-foreground/80 truncate flex-1">
                                                        {(r as any)?.nome}
                                                    </div>
                                                    <div
                                                        className="shrink-0 font-mono font-bold text-[12px] tabular-nums whitespace-nowrap"
                                                        style={{ color: amountColor }}
                                                        title={tipo}
                                                    >
                                                        {amountPrefix}
                                                        {eur(amountNum)}
                                                    </div>
                                                </div>

                                                {/* Riga 2: Data + Categoria */}
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {dateLabel ? (
                                                        <div className="shrink-0 font-mono text-[9px] text-foreground/35 tabular-nums whitespace-nowrap">
                                                            {dateLabel}
                                                        </div>
                                                    ) : null}

                                                    {catLabel ? (
                                                        <span
                                                            className="
                                                                shrink-0
                                                                font-mono
                                                                text-[9px]
                                                                leading-none
                                                                px-1.5 py-0.5
                                                                rounded-lg
                                                                border
                                                                uppercase
                                                                tracking-[0.04em]
                                                                whitespace-nowrap
                                                            "
                                                            style={{
                                                                borderColor: `${categoryColor}55`,
                                                                backgroundColor: `${categoryColor}22`,
                                                                color: categoryColor,
                                                            }}
                                                            title={catLabel}
                                                        >
                                                            {catLabel}
                                                        </span>
                                                    ) : (
                                                        <span className="shrink-0 text-[9px] leading-none px-1.5 py-0.5 rounded-full border border-white/15 text-white/55 whitespace-nowrap">
                                                            Senza
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Riga 3: Note (solo se presenti) */}
                                                {(r as any)?.notes && String((r as any).notes).trim() !== '' && (
                                                    <div
                                                        className="font-mono text-[9px] text-muted-foreground/55 italic mt-0.5 overflow-hidden"
                                                        style={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                        }}
                                                        title={(r as any).notes}
                                                    >
                                                        {(r as any).notes}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Azioni (stopPropagation per non triggerare click riga) */}
                                            <div className="shrink-0 flex items-center gap-1 self-stretch">
                                                <ActionEditButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit?.(r);
                                                    }}
                                                />
                                                <ActionDeleteButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setToDelete(r);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>,
                                );
                            });

                            return out;
                        })}
                    </div>

                    {/* ===================================================
                       DESKTOP / TABLET (md+): versione PC
                       =================================================== */}
                    <ul className="hidden md:block mt-2 px-2">
                        {gruppiPresenti.map((freq, idx) => (
                            <RicorrenzaGroup
                                key={freq}
                                freq={freq}
                                items={gruppi[freq]}
                                showSeparator={idx > 0}
                                onEdit={onEdit}
                                onDelete={(r) => setToDelete(r)}
                            />
                        ))}
                    </ul>
                </>
            )}
            <ConfirmDialog
                open={!!toDelete}
                type="delete"
                title="Vuoi davvero eliminare questa ricorrenza?"
                highlight={
                    toDelete && (
                        <div className="flex flex-col items-center">
                            <span className="italic">{(toDelete as any)?.nome}</span>
                            {(toDelete as any)?.importo && <span>{eur((toDelete as any)?.importo)}</span>}
                            {(toDelete as any)?.categoria && <span>{(toDelete as any)?.categoria}</span>}
                            {(toDelete as any)?.frequenza && (
                                <span className="text-xs">
                                    {FREQUENZE_LABEL?.[(toDelete as any)?.frequenza] ?? (toDelete as any)?.frequenza}
                                </span>
                            )}
                        </div>
                    )
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setToDelete(null)}
                loading={loading}
            />
        </div>
    );
}
