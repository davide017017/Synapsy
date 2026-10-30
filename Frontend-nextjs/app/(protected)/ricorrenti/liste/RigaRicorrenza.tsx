"use client";

// =======================================================
// RigaRicorrenza.tsx — Riga densa (max 34px) condivisa
// data · nome (+ note) · badge categoria · importo · ⋮
// - Bordo sinistro = colore frequenza (label nel tooltip)
// - Tap riga → dettaglio (onEdit); ⋮ → Modifica / Elimina
// - FIX DOM: wrapper cliccabile = div role="button", ⋮ fratello
// =======================================================

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useCategories } from "@/context/CategoriesContext";
import type { RigaRicorrenzaProps } from "@/types/ricorrenti/liste";
import { getFreqPill } from "../utils/ricorrenza-utils";
import { eur } from "@/utils/formatCurrency";

function formatData(data: string, showYear: boolean) {
    const d = new Date(data);
    if (!data || isNaN(d.getTime())) return "";
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", ...(showYear && { year: "2-digit" }) });
}

// =======================================================
// Menu ⋮ (Modifica / Elimina)
// =======================================================
function MenuAzioni({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent | TouchEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", close);
        document.addEventListener("touchstart", close);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", close);
            document.removeEventListener("touchstart", close);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const voce = "flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.06em]";

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground/50 transition hover:bg-primary/10 hover:text-primary active:scale-95"
                aria-label="Azioni ricorrenza"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <MoreVertical size={15} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-30 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-primary/20 bg-black/90 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.4)]"
                >
                    <button
                        type="button"
                        role="menuitem"
                        className={`${voce} text-primary hover:bg-primary/10`}
                        onClick={() => {
                            setOpen(false);
                            onEdit();
                        }}
                    >
                        <Pencil size={13} />
                        Modifica
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        className={`${voce} text-red-400/85 hover:bg-red-500/10 hover:text-red-300`}
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                    >
                        <Trash2 size={13} />
                        Elimina
                    </button>
                </div>
            )}
        </div>
    );
}

// =======================================================
// COMPONENTE
// =======================================================
export default function RigaRicorrenza({ r, data, showYear = false, onEdit, onDelete }: RigaRicorrenzaProps) {
    const { categories } = useCategories();

    const isIncome = r.type === "entrata";
    const amountColor = isIncome ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";
    const bgRow = isIncome ? "bg-[hsl(var(--c-success)/0.05)]" : "bg-[hsl(var(--c-danger)/0.04)]";

    const { label: freqLabel, style: freqStyle } = getFreqPill(r.frequenza);
    const catColor = String(r.category_color || categories.find((c) => c.id === r.category_id)?.color || "");
    const notes = String(r.notes ?? "").trim();

    return (
        <li
            className={`flex h-[34px] items-center gap-1.5 border-b border-primary/10 pl-2 pr-0.5 transition-colors hover:bg-primary/5 ${bgRow}`}
            style={{ borderLeft: `3px solid ${freqStyle.borderColor}` }}
        >
            <div
                role="button"
                tabIndex={0}
                onClick={() => onEdit(r)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onEdit(r);
                }}
                className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2"
                title={`${r.nome} · ${freqLabel}${notes ? ` — ${notes}` : ""}`}
            >
                {/* Data */}
                <span
                    className={`shrink-0 font-mono text-[10px] tabular-nums text-foreground/40 ${showYear ? "w-[46px]" : "w-[30px]"}`}
                >
                    {formatData(data, showYear)}
                </span>

                {/* Nome + note */}
                <span className="min-w-0 flex-1 truncate font-mono text-[12px] font-semibold text-foreground/80">
                    {r.nome}
                    {notes && <span className="ml-1 text-[9px] font-normal italic text-muted-foreground/50">· {notes}</span>}
                </span>

                {/* Badge categoria */}
                {r.categoria ? (
                    <span
                        className="max-w-[4.5rem] shrink-0 truncate rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.04em]"
                        style={
                            catColor
                                ? { borderColor: `${catColor}55`, backgroundColor: `${catColor}22`, color: catColor }
                                : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }
                        }
                    >
                        {r.categoria}
                    </span>
                ) : (
                    <span className="shrink-0 rounded-md border border-white/15 px-1.5 py-0.5 font-mono text-[9px] leading-none text-white/55">
                        Senza
                    </span>
                )}

                {/* Importo */}
                <span
                    className="shrink-0 whitespace-nowrap text-right font-mono text-[12px] font-bold tabular-nums"
                    style={{ color: amountColor }}
                >
                    {isIncome ? "+" : "–"}
                    {eur(r.importo ?? 0)}
                </span>
            </div>

            <MenuAzioni onEdit={() => onEdit(r)} onDelete={() => onDelete(r)} />
        </li>
    );
}
