// ╔══════════════════════════════════════════════════════╗
// ║   TransactionListFilter.tsx — Filtro tabella        ║
// ╚══════════════════════════════════════════════════════╝
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Import
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo } from "react";
import { RotateCcw, Search, Funnel, Tag } from "lucide-react";
import type { TransactionListFilterProps, TxCategory } from "@/types/transazioni/list";

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Component
// ─────────────────────────────────────────────────────────────────────────────
export default function TransactionListFilter({
    filter,
    setFilter,
    categories,
    iconSearch,
    iconType,
    iconCategory,
}: TransactionListFilterProps) {
    // ─────────────────────────────────────────────────────────────────────────
    // Sezione: Derivazioni memoizzate (performance)
    // ─────────────────────────────────────────────────────────────────────────
    const filteredCategories = useMemo(() => {
        return filter.type === "tutti" ? categories : categories.filter((cat) => cat.type === filter.type);
    }, [categories, filter.type]);

    const uniqueCategories = useMemo(() => {
        const map = filteredCategories.reduce<Map<number, TxCategory>>((acc, cat) => acc.set(cat.id, cat), new Map());
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredCategories]);

    // ─────────────────────────────────────────────────────────────────────────
    // Sezione: Reset categoria se non valida al cambio tipo
    // Dettagli: setFilter richiede un Filter (no updater function)
    // filter escluso dai deps: l'effetto deve reagire solo al cambio di
    // uniqueCategories; includerlo creerebbe un loop (setFilter → nuovo
    // oggetto filter → effetto → setFilter…).
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const categoryStillValid = uniqueCategories.some((cat) => String(cat.id) === filter.category);
        if (filter.category !== "tutte" && !categoryStillValid) {
            setFilter({ ...filter, category: "tutte" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueCategories, setFilter]);

    // ─────────────────────────────────────────────────────────────────────────
    // Sezione: Render ordinato e compatto
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="bg-black/25 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sticky top-4 flex flex-col gap-3 min-w-0">
            {/* ===== Intestazione ===== */}
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/45">Filtra</h3>

            {/* ===== Ricerca ===== */}
            <label className="flex items-center gap-2">
                {iconSearch ?? <Search size={16} className="opacity-70" />}
                <input
                    type="text"
                    placeholder="Cerca descrizione…"
                    className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-black/20 text-sm font-mono placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--c-primary)/0.5)] transition"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
            </label>

            {/* ===== Tipo transazione ===== */}
            <label className="flex items-center gap-2">
                {iconType ?? <Funnel size={16} className="opacity-70" />}
                <select
                    className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-sm font-mono cursor-pointer focus:outline-none focus:ring-1 focus:ring-[hsl(var(--c-primary)/0.5)] transition"
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                >
                    <option value="tutti">Tutti i tipi</option>
                    <option value="entrata">Entrate</option>
                    <option value="spesa">Spese</option>
                </select>
            </label>

            {/* ===== Categoria dinamica ===== */}
            <label className="flex items-center gap-2">
                {iconCategory ?? <Tag size={16} className="opacity-70" />}
                <select
                    className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-sm font-mono cursor-pointer focus:outline-none focus:ring-1 focus:ring-[hsl(var(--c-primary)/0.5)] transition"
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    disabled={uniqueCategories.length === 0}
                >
                    <option value="tutte">Tutte le categorie</option>
                    {uniqueCategories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </label>

            {/* ===== Pulsante reset ===== */}
            <button
                type="button"
                className="mt-1 w-full px-3 py-2 rounded-xl border border-yellow-400/35 bg-yellow-400/10 text-yellow-400 text-[11px] font-mono font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 hover:bg-yellow-400/20 active:scale-95 transition"
                onClick={() => setFilter({ search: "", type: "tutti", category: "tutte" })}
            >
                <RotateCcw size={16} className="opacity-80" />
                Reset
            </button>
        </div>
    );
}
// ============================
// END TransactionListFilter
// ============================
