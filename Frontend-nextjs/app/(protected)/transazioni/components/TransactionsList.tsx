"use client";

// ====================================================
// TransactionsList.tsx
// Lista transazioni con filtro e tabella — responsive
// ====================================================

import { useState, useMemo, useEffect } from "react";
import TransactionListFilter from "./list/TransactionListFilter";
import TransactionTable from "./list/TransactionTable";
import { useSelection } from "@/context/SelectionContext";
import { useCategories } from "@/context/CategoriesContext";
import { Funnel, Search, Tag, RefreshCw, SlidersHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { TransactionsListProps } from "@/types/transazioni/list";

// ----------------------------------------------
// Helper: format importo (fallback semplice)
// ----------------------------------------------
function formatAmount(amount: number) {
    try {
        return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount);
    } catch {
        return `${amount.toFixed(2)} €`;
    }
}

// ----------------------------------------------
// Helper: format data (fallback semplice)
// ----------------------------------------------
function formatDate(dateStr: string) {
    try {
        return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
            new Date(dateStr)
        );
    } catch {
        return dateStr;
    }
}

// ----------------------------------------------
// Componente principale lista + filtro + tabella
// ----------------------------------------------
export default function TransactionsList({ transactions, onSelect, selectedId }: TransactionsListProps) {
    // ===== Stato filtro frontend =====
    const [filter, setFilter] = useState({
        search: "",
        type: "tutti",
        category: "tutte",
    });

    const { categories } = useCategories();
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();

    const [visible, setVisible] = useState(20);

    // --------------------------------------------------
    // UI: toggle filtri su mobile
    // --------------------------------------------------
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // --------------------------------------------------
    // Applica filtri e ordina dalla più recente alla più vecchia
    // --------------------------------------------------
    const filtered = useMemo(() => {
        return transactions
            .filter((t) => {
                const matchType = filter.type === "tutti" || t.category?.type === filter.type;
                const matchCategory = filter.category === "tutte" || String(t.category?.id) === filter.category;
                const matchSearch = t.description.toLowerCase().includes(filter.search.toLowerCase());
                return matchType && matchCategory && matchSearch;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, filter]);

    useEffect(() => {
        // --------------------------------------------------
        // Mostra almeno un blocco di 20 risultati se disponibili
        // --------------------------------------------------
        setVisible(filtered.length < 20 ? filtered.length : 20);
    }, [filter, transactions, filtered]);

    // ===== Render Vuoto =====
    if (!transactions.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground text-sm py-8">
                Nessuna transazione trovata.
                <br />
                <span className="opacity-80">Vuoi crearne una?</span>
            </div>
        );
    }

    const shown = filtered.slice(0, visible);

    // ===== Render Responsive =====
    return (
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-full">
            {/* ===================================================
               MOBILE: barra filtri (collapsible)
               =================================================== */}
            <div className="lg:hidden w-full">
                <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen((v) => !v)}
                    className="
                        w-full rounded-2xl border border-bg-elevate bg-bg-elevate/40
                        px-4 py-3 flex items-center justify-between
                        shadow-sm
                    "
                >
                    <span className="flex items-center gap-2 font-semibold">
                        <SlidersHorizontal size={18} />
                        Filtri
                    </span>
                    <span className="text-sm text-muted-foreground">{isMobileFiltersOpen ? "Chiudi" : "Apri"}</span>
                </button>

                {isMobileFiltersOpen && (
                    <div className="mt-3">
                        <TransactionListFilter
                            filter={filter}
                            setFilter={setFilter}
                            categories={categories}
                            iconSearch={<Search size={16} className="text-primary" />}
                            iconType={<Funnel size={16} className="text-secondary" />}
                            iconCategory={<Tag size={16} className="text-accent" />}
                        />
                    </div>
                )}
            </div>

            {/* ===================================================
               DESKTOP: filtro a lato (invariato)
               =================================================== */}
            <div className="hidden lg:block lg:w-64 w-full flex-shrink-0 mb-2 lg:mb-0">
                <TransactionListFilter
                    filter={filter}
                    setFilter={setFilter}
                    categories={categories}
                    iconSearch={<Search size={16} className="text-primary" />}
                    iconType={<Funnel size={16} className="text-secondary" />}
                    iconCategory={<Tag size={16} className="text-accent" />}
                />
            </div>

            {/* ===================================================
               CONTENUTO: mobile cards / desktop table
               =================================================== */}
            <div className="grid min-w-0 w-full">
                {/* ---------- MOBILE: Cards ---------- */}
                <div className="lg:hidden space-y-2">
                    {shown.map((t) => {
                        const isIncome = (t.category?.type ?? "") === "entrata" || t.amount > 0;
                        const isSelected = selectedId === t.id;

                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelect(t)}
                                className={`
                                    w-full text-left rounded-2xl border
                                    bg-bg-elevate/30
                                    px-4 py-3
                                    transition
                                    ${isSelected ? "border-primary/60 shadow-md" : "border-bg-elevate"}
                                `}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            {isIncome ? (
                                                <ArrowUpRight className="text-success" size={18} />
                                            ) : (
                                                <ArrowDownRight className="text-danger" size={18} />
                                            )}
                                            <div className="font-semibold truncate">{t.description}</div>
                                        </div>

                                        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                                            <span>{formatDate(String(t.date))}</span>
                                            {t.category?.name ? (
                                                <span className="px-2 py-0.5 rounded-full border border-bg-elevate bg-bg-elevate/30">
                                                    {t.category.name}
                                                </span>
                                            ) : (
                                                <span className="opacity-70">Senza categoria</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`shrink-0 font-bold ${isIncome ? "text-success" : "text-danger"}`}>
                                        {formatAmount(Number(t.amount))}
                                    </div>
                                </div>

                                {/* Selection mode: mini hint (solo se attivo) */}
                                {isSelectionMode && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {selectedIds.includes(t.id)
                                            ? "Selezionata"
                                            : "Tocca per aprire • usa checkbox nella tabella su desktop"}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ---------- DESKTOP: Tabella ---------- */}
                <div className="hidden lg:block">
                    <TransactionTable
                        data={shown}
                        onRowClick={onSelect}
                        selectedId={selectedId}
                        isSelectionMode={isSelectionMode}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div>

                {/* ---------- Footer conteggio ---------- */}
                <div className="mt-2 text-xs text-muted-foreground text-center">
                    {`${Math.min(visible, filtered.length)} di ${filtered.length} transazioni `}
                    {filter.search !== "" || filter.type !== "tutti" || filter.category !== "tutte"
                        ? "filtrate"
                        : "totali"}
                </div>

                {/* ---------- Load more ---------- */}
                {visible < filtered.length ? (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setVisible((v) => v + 20)}
                            className="
                                w-full py-2 rounded-2xl font-semibold
                                flex justify-center items-center gap-2
                                text-white shadow-md
                                transition-all duration-200
                                hover:shadow-2xl hover:-translate-y-0.5
                                active:scale-95
                                focus:outline-none focus:ring-2 focus:ring-primary/40
                            "
                            style={{ background: "var(--c-primary-gradient)" }}
                            aria-label="Carica altre transazioni"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Carica altre transazioni
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Hai visualizzato tutte le transazioni.
                    </div>
                )}
            </div>
        </div>
    );
}

/*
File: TransactionsList.tsx
Scopo: gestisce filtri, paginazione (visible) e rendering responsive.
Come: su desktop mostra filtro laterale + tabella; su mobile mostra un toggle filtri e una lista a card più leggibile.
*/
