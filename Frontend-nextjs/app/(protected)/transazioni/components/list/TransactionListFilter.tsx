// ╔══════════════════════════════════════════════════════╗
// ║   TransactionListFilter.tsx — Filtro tabella        ║
// ╚══════════════════════════════════════════════════════╝

"use client";

import React, { useEffect } from "react";
import { RotateCcw, Search, Funnel, Tag } from "lucide-react";
import type { TransactionListFilterProps, Filter, Category } from "@/types/transazioni/list";

// =========================
// TransactionListFilter
// =========================
export default function TransactionListFilter({
    filter,
    setFilter,
    categories,
    iconSearch,
    iconType,
    iconCategory,
}: TransactionListFilterProps) {
    // Categorie filtrate per tipo
    const filteredCategories =
        filter.type === "tutti" ? categories : categories.filter((cat) => cat.type === filter.type);

    // Ordina e deduplica
    const uniqueCategories = Array.from(
        filteredCategories.reduce((acc, cat) => acc.set(cat.id, cat), new Map<number, Category>()).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    // Reset categoria se cambia tipo
    useEffect(() => {
        if (filter.category !== "tutte" && !filteredCategories.some((cat) => String(cat.id) === filter.category)) {
            setFilter({ ...filter, category: "tutte" });
        }
    }, [filter.type, filter.category, filteredCategories, setFilter]);

    // =========================
    // Render ordinato e compatto
    // =========================
    return (
        <div className="bg-bg-alt dark:bg-bg-soft rounded-2xl shadow p-4 sticky top-4 flex flex-col gap-2 border border-primary/20 border-bg-elevate min-w-0">
            {/* ===== Intestazione ===== */}
            <h3 className="text-base font-semibold mb-1 text-primary">Filtra</h3>

            {/* ===== Ricerca ===== */}
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                {iconSearch ?? <Search size={16} className="opacity-70" />}
                <input
                    type="text"
                    placeholder="Cerca descrizione…"
                    className="flex-1 px-3 py-2 rounded border border-bg-elevate bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none transition"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
            </label>

            {/* ===== Tipo transazione ===== */}
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                {iconType ?? <Funnel size={16} className="opacity-70" />}
                <select
                    className="flex-1 px-3 py-2 cursor-pointer rounded-xl border border-bg-elevate bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none transition shadow hover:bg-bg-soft"
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                >
                    <option value="tutti">Tutti i tipi</option>
                    <option value="entrata">Entrate</option>
                    <option value="spesa">Spese</option>
                </select>
            </label>

            {/* ===== Categoria dinamica ===== */}
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                {iconCategory ?? <Tag size={16} className="opacity-70" />}
                <select
                    className="flex-1 px-3 py-2 cursor-pointer rounded-xl border border-bg-elevate bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none transition shadow hover:bg-bg-soft"
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
                className="mt-2 px-3 py-1.5 rounded-xl bg-bg-elevate border border-primary text-primary text-xs font-semibold flex items-center justify-center gap-2 hover:bg-warning hover:text-bg transition shadow active:scale-95 cursor-pointer"
                onClick={() => setFilter({ search: "", type: "tutti", category: "tutte" })}
            >
                <RotateCcw size={16} className="opacity-80" />
                Reset
            </button>
        </div>
    );
}
