"use client";

// ╔══════════════════════════════════════════════════════╗
// ║ ListaProssimiPagamenti.tsx — border riga categoria  ║
// ╚══════════════════════════════════════════════════════╝

import { Ricorrenza } from "@/types/models/ricorrenza";
import type { ListaProssimiPagamentiProps, SectionOccorrenzeProps } from "@/types/ricorrenti/liste";
import { normalizzaFrequenza, freqToIt, freqToDays } from "../utils/ricorrenza-utils";
import { Pencil, Trash2 } from "lucide-react";
import { useCategories } from "@/context/CategoriesContext";
import { eur } from "@/utils/formatCurrency";

// ============================
// Props tipizzate
// ============================

// ============================
// Helper: Espandi occorrenze future
// ============================
function expandOccurrences(r: Ricorrenza, from: Date, to: Date) {
    const freqNorm = normalizzaFrequenza(r.frequenza);
    const step = freqToDays[freqNorm] ?? 30;
    const occs: { ricorrenza: Ricorrenza; data: string }[] = [];
    let current = new Date(r.prossima);
    if (current < from) {
        const diffDays = Math.ceil((from.getTime() - current.getTime()) / (1000 * 3600 * 24));
        const multipli = Math.ceil(diffDays / step);
        current.setDate(current.getDate() + multipli * step);
    }
    while (current <= to) {
        occs.push({ ricorrenza: r, data: current.toISOString().slice(0, 10) });
        current.setDate(current.getDate() + step);
    }
    return occs;
}

// ============================
// Helper: Calcola bilancio
// ============================
function calcolaBilancio(arr: { ricorrenza: Ricorrenza; data: string }[]) {
    return arr.reduce(
        (sum, occ) => sum + (occ.ricorrenza.type === "entrata" ? 1 : -1) * (occ.ricorrenza.importo ?? 0),
        0,
    );
}

// ============================
// Helper: Colore pill bilancio
// ============================
function getBilancioUtility(bilancio: number) {
    if (bilancio > 0)
        return "text-[hsl(var(--c-total-positive-text))] bg-[hsl(var(--c-total-positive-bg))] border-[hsl(var(--c-total-positive-border))]";
    if (bilancio < 0)
        return "text-[hsl(var(--c-total-negative-text))] bg-[hsl(var(--c-total-negative-bg))] border-[hsl(var(--c-total-negative-border))]";
    return "text-[hsl(var(--c-total-neutral-text))] bg-[hsl(var(--c-total-neutral-bg))] border-[hsl(var(--c-total-neutral-border))]";
}

// ============================
// Helper: Pill frequenza
// ============================
function getFreqPill(frequenza: string) {
    const freqNorm = normalizzaFrequenza(frequenza);

    const freqVars: Record<string, { bg: string; text: string; border: string }> = {
        daily: { bg: "var(--c-freq-daily-bg)", text: "var(--c-freq-daily-text)", border: "var(--c-freq-daily-border)" },
        weekly: {
            bg: "var(--c-freq-weekly-bg)",
            text: "var(--c-freq-weekly-text)",
            border: "var(--c-freq-weekly-border)",
        },
        monthly: {
            bg: "var(--c-freq-monthly-bg)",
            text: "var(--c-freq-monthly-text)",
            border: "var(--c-freq-monthly-border)",
        },
        annually: {
            bg: "var(--c-freq-annually-bg)",
            text: "var(--c-freq-annually-text)",
            border: "var(--c-freq-annually-border)",
        },
        biennial: {
            bg: "var(--c-freq-biennial-bg)",
            text: "var(--c-freq-biennial-text)",
            border: "var(--c-freq-biennial-border)",
        },
        custom: {
            bg: "var(--c-freq-custom-bg)",
            text: "var(--c-freq-custom-text)",
            border: "var(--c-freq-custom-border)",
        },
    };

    const { bg, text, border } = freqVars[freqNorm] ?? freqVars.custom;
    const label = freqToIt[freqNorm] ?? frequenza;

    const style = {
        backgroundColor: `hsl(${bg})`,
        color: `hsl(${text})`,
        borderColor: `hsl(${border})`,
        borderWidth: 1,
        fontWeight: 600,
    };

    return { label, style };
}

// ===========================================================
// Componente principale
// ===========================================================
export default function ListaProssimiPagamenti({
    pagamenti,
    filtro,
    setFiltro,
    totaleSettimana,
    totaleMese,
    onEditOccorrenza,
    onDeleteOccorrenza,
}: ListaProssimiPagamentiProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekTo = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
    const monthTo = new Date(today.getTime() + 29 * 24 * 60 * 60 * 1000);

    let occorrenze7: { ricorrenza: Ricorrenza; data: string }[] = [];
    let occorrenze30: { ricorrenza: Ricorrenza; data: string }[] = [];
    for (const ric of pagamenti) {
        occorrenze7 = occorrenze7.concat(expandOccurrences(ric, today, weekTo));
        occorrenze30 = occorrenze30.concat(
            expandOccurrences(ric, new Date(weekTo.getTime() + 24 * 60 * 60 * 1000), monthTo),
        );
    }
    occorrenze7.sort((a, b) => a.data.localeCompare(b.data));
    occorrenze30.sort((a, b) => a.data.localeCompare(b.data));

    const bilancio7 = calcolaBilancio(occorrenze7);
    const bilancio30 = calcolaBilancio(occorrenze30);

    return (
        <div className="flex flex-col gap-3 font-mono">
            {" "}
            {/* === Tabs filtro periodo === */}
            <div className="flex gap-2 mb-1 flex-wrap">
                {(["tutti", "settimana", "mese"] as const).map((tab) => (
                    <button
                        key={tab}
                        className={`
                          px-3 py-1.5
                          rounded-xl
                          border
                          font-mono
                          text-[10px]
                          uppercase
                          tracking-[0.08em]
                          transition-all duration-200
                          active:scale-95
                          ${
                              filtro === tab
                                  ? "bg-primary/15 text-primary border-primary/35 shadow-[0_0_14px_hsl(var(--c-primary)/0.18)]"
                                  : "bg-white/5 text-foreground/45 border-white/10 hover:text-primary hover:bg-primary/10 hover:border-primary/25"
                          }
                      `}
                        onClick={() => setFiltro(tab)}
                    >
                        {tab === "tutti" ? "Tutti" : tab === "settimana" ? "7 giorni" : "dal 7 al 30 giorno"}
                    </button>
                ))}
            </div>
            {/* === Sezioni dinamiche === */}
            {filtro === "tutti" && (
                <>
                    <SectionOccorrenze
                        title="Prossimi 7 giorni"
                        occorrenze={occorrenze7}
                        bilancio={bilancio7}
                        onEdit={onEditOccorrenza}
                        onDelete={onDeleteOccorrenza}
                    />
                    <SectionOccorrenze
                        title="Prossimi 30 giorni"
                        occorrenze={occorrenze30}
                        bilancio={bilancio30}
                        onEdit={onEditOccorrenza}
                        onDelete={onDeleteOccorrenza}
                    />
                </>
            )}
            {filtro === "settimana" && (
                <SectionOccorrenze
                    title="Prossimi 7 giorni"
                    occorrenze={occorrenze7}
                    bilancio={bilancio7}
                    onEdit={onEditOccorrenza}
                    onDelete={onDeleteOccorrenza}
                />
            )}
            {filtro === "mese" && (
                <SectionOccorrenze
                    title="Prossimi 30 giorni"
                    occorrenze={occorrenze30}
                    bilancio={bilancio30}
                    onEdit={onEditOccorrenza}
                    onDelete={onDeleteOccorrenza}
                />
            )}
            {/* === Totali riepilogo === */}
            <div
                className="
                  flex gap-3 mt-1 flex-wrap
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.08em]
                  text-foreground/45
              "
            >
                {" "}
                <span>
                    Settimana: <b className="text-primary font-bold">{eur(totaleSettimana)}</b>
                </span>
                <span>
                    Mese: <b className="text-primary font-bold">{eur(totaleMese)}</b>
                </span>
            </div>
        </div>
    );
}

// ===========================================================
// SectionOccorrenze — bordo sinistro colore categoria
// ===========================================================
function SectionOccorrenze({ title, occorrenze, bilancio, onEdit, onDelete }: SectionOccorrenzeProps) {
    const { categories } = useCategories();

    return (
        <div>
            <div className="flex items-center justify-between mb-2 px-1 gap-2">
                <h3
                    className="
                      font-mono
                      text-[12px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-primary
                      truncate
                  "
                >
                    {title}
                </h3>{" "}
                <span
                    className={`
                      ml-2
                      px-2.5 py-1
                      rounded-xl
                      border
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.06em]
                      shadow-[0_0_12px_rgba(0,0,0,0.16)]
                      ${getBilancioUtility(bilancio)}
                  `}
                    style={{ minWidth: 90, textAlign: "center" }}
                >
                    Bilancio: {bilancio >= 0 ? "+" : "–"}
                    {eur(Math.abs(bilancio))}
                </span>
            </div>
            <ul className="space-y-1">
                {" "}
                {occorrenze.length === 0 ? (
                    <li
                        className="
                          py-3
                          text-center
                          font-mono
                          text-[10px]
                          uppercase
                          tracking-[0.10em]
                          text-foreground/35
                      "
                    >
                        {" "}
                        Nessun pagamento.
                    </li>
                ) : (
                    occorrenze.map(({ ricorrenza: r, data }, i) => {
                        // Trova categoria
                        const category = categories.find((cat) => cat.id === r.category_id);
                        const { label, style } = getFreqPill(r.frequenza);

                        // Bordo sinistro = colore categoria (se c'è)
                        const borderRow = "border-l-4 border-r-4";
                        const borderStyle = category?.color ? { borderLeftColor: category.color } : {};

                        const bgRow =
                            r.type === "entrata" ? "bg-[hsl(var(--c-success)/0.07)]" : "bg-[hsl(var(--c-danger)/0.06)]";

                        const textRow =
                            r.type === "entrata"
                                ? "text-[hsl(var(--c-success-dark))]"
                                : "text-[hsl(var(--c-danger-dark))]";

                        return (
                            <li
                                key={r.id + "-" + data + "-" + i}
                                className={`
                                    flex items-center gap-2
                                    px-2 py-2
                                    rounded-xl
                                    border border-white/10
                                    text-xs
                                    backdrop-blur-sm
                                    transition-colors
                                    hover:bg-primary/5
                                    ${bgRow} ${borderRow}
                                `}
                                style={{
                                    minHeight: 30,
                                    fontSize: 13,
                                    ...borderStyle,
                                }}
                            >
                                {/* Data */}
                                <span className="font-mono w-12 text-right text-foreground/35 select-none text-[10px]">
                                    {" "}
                                    {new Date(data).toLocaleDateString("it-IT", {
                                        day: "2-digit",
                                        month: "2-digit",
                                    })}
                                </span>
                                {/* Nome */}
                                <span className="truncate font-mono font-semibold max-w-[7.5rem] text-foreground/80 text-[12px]">
                                    {" "}
                                    {r.nome}
                                </span>
                                {(r as any)?.notes && String((r as any).notes).trim() !== '' && (
                                    <>
                                        <span className="text-muted-foreground/30 text-[9px]"> · </span>
                                        <span
                                            className="font-mono text-[9px] text-muted-foreground/50 italic truncate max-w-[7.5rem]"
                                            title={(r as any).notes}
                                        >
                                            {(r as any).notes}
                                        </span>
                                    </>
                                )}
                                {/* Categoria */}
                                <span
                                    className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.04em] max-w-[5.5rem] truncate"
                                    style={category?.color ? { color: category.color } : {}}
                                >
                                    {r.categoria}
                                </span>

                                <div className="flex items-center gap-2 ml-auto min-w-[115px] justify-end">
                                    {/* Importo */}
                                    <span
                                        className={`font-mono font-bold pr-1 text-[12px] ${textRow}`}
                                        style={{ minWidth: 64, textAlign: "right" }}
                                    >
                                        {r.type === "entrata" ? "+" : "–"}
                                        {eur(r.importo ?? 0)}
                                    </span>
                                    {/* Pill frequenza */}
                                    <span
                                        className="
                                            px-2 py-0.5
                                            rounded-lg
                                            border
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.06em]
                                        "
                                        style={{
                                            ...style,
                                            minWidth: 42,
                                            textAlign: "center",
                                            lineHeight: 1.5,
                                            letterSpacing: "0.02em",
                                        }}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {/* Azioni */}
                                {(onEdit || onDelete) && (
                                    <div className="flex gap-1 pl-1">
                                        {onEdit && (
                                            <button
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
                                                title="Modifica"
                                                onClick={() => onEdit(r)}
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
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
                                                title="Elimina"
                                                onClick={() => onDelete(r)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}
