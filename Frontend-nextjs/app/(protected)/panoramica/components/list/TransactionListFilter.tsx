// ╔══════════════════════════════════════════════════════╗
// ║     TransactionListFilter.tsx — Filtro tabella      ║
// ╚══════════════════════════════════════════════════════╝

import React, { useEffect } from "react";
import { RotateCcw } from "lucide-react";

// =========================
// Tipi Props
// =========================
type Filter = {
    search: string;
    type: string;
    category: string;
};

type Category = { name: string; id: number; type: string };

type Props = {
    filter: Filter;
    setFilter: (f: Filter) => void;
    categories: Category[];
};

// ╔══════════════════════════════════════════════════════╗
// ║     TransactionListFilter: pannello filtri           ║
// ╚══════════════════════════════════════════════════════╝
export default function TransactionListFilter({ filter, setFilter, categories }: Props) {
    // =========================
    // Categorie filtrate per tipo selezionato (solo quelle pertinenti)
    // =========================
    const filteredCategories =
        filter.type === "tutti" ? categories : categories.filter((cat) => cat.type === filter.type);

    // =========================
    // Categorie uniche ordinate per nome
    // =========================
    const uniqueCategories = Array.from(
        filteredCategories.reduce((acc, cat) => acc.set(cat.id, cat), new Map<number, Category>()).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    // =========================
    // Reset categoria se cambia tipo e non esiste più la selezione attuale
    // =========================
    useEffect(() => {
        if (filter.category !== "tutte" && !filteredCategories.some((cat) => String(cat.id) === filter.category)) {
            setFilter({ ...filter, category: "tutte" });
        }
    }, [filter.type, filter.category, filteredCategories, setFilter]);

    // =========================
    // Render
    // =========================
    return (
        <div className="bg-bg-alt dark:bg-bg-soft rounded-2xl shadow p-4 sticky top-4 flex flex-col gap-4 border border-primary/20 border-bg-elevate">
            {/* ========== Intestazione ========== */}
            <h3 className="text-base font-semibold mb-1 text-primary">Filtra</h3>

            {/* ========== Campo ricerca ========== */}
            <input
                type="text"
                placeholder="Cerca descrizione…"
                className="px-3 py-2 rounded border border-bg-elevate bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none transition"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />

            {/* ========== Tipo transazione ========== */}
            <select
                className="px-3 py-2 cursor-pointer focus:border-primary shadow-black shadow-lg hover:shadow-none rounded-xl hover:bg-bg-soft border border-bg-elevate bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none transition"
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
                <option value="tutti">Tutti i tipi</option>
                <option value="entrata">Entrate</option>
                <option value="spesa">Spese</option>
            </select>

            {/* ========== Categoria dinamica ========== */}
            <select
                className="px-3 py-2 cursor-pointer focus:border-primary shadow-black shadow-lg hover:shadow-none rounded-xl hover:bg-bg-soft border border-bg-elevate bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none transition"
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

            {/* ========== Pulsante reset ========== */}
            <button
                type="button"
                className="
                    mt-2 px-3 py-1.5 rounded-xl
                    bg-bg-elevate
                    border border-primary
                    text-primary
                    text-sm
                    font-semibold
                    flex items-center justify-center gap-2
                    hover:bg-warning hover:text-bg
                    transition
                    shadow
                    active:scale-95
                    cursor-pointer
                "
                onClick={() => setFilter({ search: "", type: "tutti", category: "tutte" })}
            >
                <RotateCcw size={18} className="opacity-80" />
                Reset
            </button>
        </div>
    );
}
