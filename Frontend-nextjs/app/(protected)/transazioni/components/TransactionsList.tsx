"use client";

// ====================================================
// TransactionsList.tsx
// Lista transazioni con filtro e tabella — responsive
// (Mobile: dense + divider anno/mese con totali e label)
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
// Helper: label mese (YYYY-MM -> "Mese YYYY")
// ----------------------------------------------
function monthLabel(monthKey: string) {
    const [y, m] = monthKey.split("-");
    const dt = new Date(Number(y), Math.max(0, Number(m) - 1), 1);
    return dt.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

// ----------------------------------------------
// Helper: safe color (CSS var / hex / fallback)
// ----------------------------------------------
function safeColor(color?: string | null, fallback = "hsl(var(--c-primary))") {
    if (!color) return fallback;
    const c = String(color).trim();
    if (!c) return fallback;
    return c;
}

// ----------------------------------------------
// Helper: monthKey (YYYY-MM) da date string
// ----------------------------------------------
function toMonthKey(dateStr: string) {
    const s = String(dateStr);
    const y = s.slice(0, 4);
    const m = s.slice(5, 7);

    if (y.length === 4 && m.length === 2) return `${y}-${m}`;

    const d = new Date(s);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yy}-${mm}`;
}

// ----------------------------------------------
// Helper: deduci tipo transazione in modo robusto
// ----------------------------------------------
function getTxType(t: any): "entrata" | "spesa" {
    const fromCategory = t?.category?.type;
    if (fromCategory === "entrata" || fromCategory === "spesa") return fromCategory;

    const fromTx = t?.type;
    if (fromTx === "entrata" || fromTx === "spesa") return fromTx;

    // Fallback sicuro: meglio spesa che “tutto entrata”
    return "spesa";
}

// ----------------------------------------------
// Helper: crea totali da lista tx
// ----------------------------------------------
function calcTotals(list: any[]) {
    let entrate = 0;
    let spese = 0;

    for (const t of list) {
        const type = getTxType(t);
        const amount = Number(t?.amount ?? 0) || 0;

        if (type === "entrata") entrate += amount;
        else spese += amount;
    }

    return { entrate, spese, saldo: entrate - spese };
}

// ----------------------------------------------
// Helper: label compatte per i divider (testo esplicito)
// ----------------------------------------------
function TotalsInline({ entrate, spese, saldo }: { entrate: number; spese: number; saldo: number }) {
    const saldoPositivo = saldo >= 0;

    return (
        <div className="flex items-center gap-3 text-[11px] tabular-nums">
            <span className="flex items-center gap-1">
                <span className="opacity-80">Entrate:</span>
                <span className="text-[hsl(var(--c-success))] font-semibold">+{formatAmount(entrate)}</span>
            </span>

            <span className="flex items-center gap-1">
                <span className="opacity-80">Spese:</span>
                <span className="text-[hsl(var(--c-danger))] font-semibold">-{formatAmount(spese)}</span>
            </span>

            <span className="flex items-center gap-1">
                <span className="opacity-80">Saldo:</span>
                <span
                    className={`font-bold ${
                        saldoPositivo ? "text-[hsl(var(--c-success))]" : "text-[hsl(var(--c-danger))]"
                    }`}
                >
                    {formatAmount(saldo)}
                </span>
            </span>
        </div>
    );
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

    // ----------------------------------------------
    // Dati mostrati
    // ----------------------------------------------
    const shown = filtered.slice(0, visible);

    // --------------------------------------------------
    // MOBILE: raggruppa per mese e calcola totali mese/anno
    // Hook SEMPRE chiamato (non condizionale)
    // --------------------------------------------------
    type Block =
        | { kind: "year"; year: string; key: string; totals: { entrate: number; spese: number; saldo: number } }
        | {
              kind: "month";
              monthKey: string;
              key: string;
              totals: { entrate: number; spese: number; saldo: number };
          }
        | { kind: "tx"; key: string; tx: (typeof shown)[number]; index: number };

    const mobileModel = useMemo(() => {
        if (!shown.length) return { blocks: [] as Block[] };

        // 1) group per monthKey
        const byMonth = new Map<string, any[]>();
        for (const t of shown) {
            const mk = toMonthKey(String(t.date));
            if (!byMonth.has(mk)) byMonth.set(mk, []);
            byMonth.get(mk)!.push(t);
        }

        // 2) totali per mese
        const monthTotals = new Map<string, { entrate: number; spese: number; saldo: number }>();
        for (const [mk, list] of byMonth.entries()) monthTotals.set(mk, calcTotals(list));

        // 3) totali per anno (somma dai mesi)
        const yearTotals = new Map<string, { entrate: number; spese: number; saldo: number }>();
        for (const [mk, totals] of monthTotals.entries()) {
            const year = mk.slice(0, 4);
            const prev = yearTotals.get(year) ?? { entrate: 0, spese: 0, saldo: 0 };
            yearTotals.set(year, {
                entrate: prev.entrate + totals.entrate,
                spese: prev.spese + totals.spese,
                saldo: prev.saldo + totals.saldo,
            });
        }

        // 4) blocks in ordine di shown (già sortato DESC)
        const blocks: Block[] = [];
        let lastYear = "";
        let lastMonthKey = "";

        shown.forEach((tx, index) => {
            const monthKey = toMonthKey(String(tx.date));
            const year = monthKey.slice(0, 4);

            if (year !== lastYear) {
                lastYear = year;
                lastMonthKey = "";

                blocks.push({
                    kind: "year",
                    year,
                    key: `y-${year}`,
                    totals: yearTotals.get(year) ?? { entrate: 0, spese: 0, saldo: 0 },
                });
            }

            if (monthKey !== lastMonthKey) {
                lastMonthKey = monthKey;

                blocks.push({
                    kind: "month",
                    monthKey,
                    key: `m-${monthKey}`,
                    totals: monthTotals.get(monthKey) ?? { entrate: 0, spese: 0, saldo: 0 },
                });
            }

            blocks.push({
                kind: "tx",
                key: `${tx.id}-${tx.date ?? "nodate"}-${index}`,
                tx,
                index,
            });
        });

        return { blocks };
    }, [shown]);

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
               CONTENUTO: mobile dense / desktop table
               =================================================== */}
            <div className="grid min-w-0 w-full">
                {/* ---------- MOBILE: Dense list con divider + totali (ESPRESSI) ---------- */}
                <div className="lg:hidden rounded-2xl border border-bg-elevate bg-bg-elevate/20 overflow-hidden">
                    {mobileModel.blocks.map((b) => {
                        // --------------------------
                        // Divider ANNO
                        // --------------------------
                        if (b.kind === "year") {
                            return (
                                <div
                                    key={b.key}
                                    className="px-3 py-2 bg-bg-elevate/55 border-b border-bg-elevate flex items-center justify-between gap-3"
                                >
                                    <div className="text-xs font-bold tracking-wider uppercase">Anno {b.year}</div>
                                    <TotalsInline
                                        entrate={b.totals.entrate}
                                        spese={b.totals.spese}
                                        saldo={b.totals.saldo}
                                    />
                                </div>
                            );
                        }

                        // --------------------------
                        // Divider MESE
                        // --------------------------
                        if (b.kind === "month") {
                            return (
                                <div
                                    key={b.key}
                                    className="px-3 py-1.5 bg-bg-elevate/35 border-b border-bg-elevate flex items-center justify-between gap-3"
                                >
                                    <div className="text-[11px] font-semibold capitalize text-muted-foreground">
                                        Totale {monthLabel(b.monthKey)}
                                    </div>
                                    <TotalsInline
                                        entrate={b.totals.entrate}
                                        spese={b.totals.spese}
                                        saldo={b.totals.saldo}
                                    />
                                </div>
                            );
                        }

                        // --------------------------
                        // Riga transazione (dense)
                        // --------------------------
                        const t = b.tx;
                        const index = b.index;

                        const txType = getTxType(t);
                        const isIncome = txType === "entrata";
                        const isSelected = selectedId === t.id;

                        const categoryColor = safeColor(t.category?.color, "hsl(var(--c-primary))");
                        const amountColor = isIncome ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";

                        return (
                            <button
                                key={b.key ?? `${t.id}-${t.date ?? "nodate"}-${index}`}
                                type="button"
                                onClick={() => onSelect(t)}
                                className={`
                                    w-full text-left
                                    px-3 py-2
                                    transition
                                    border-b border-bg-elevate
                                    ${isSelected ? "bg-bg-elevate/60" : "hover:bg-bg-elevate/40"}
                                `}
                                style={{ borderLeft: `4px solid ${categoryColor}` }}
                            >
                                <div className="flex items-center gap-2">
                                    {/* Icon tipo (micro) */}
                                    <span className="shrink-0" style={{ color: amountColor }}>
                                        {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    </span>

                                    {/* Centro */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="font-semibold text-sm truncate">{t.description}</div>

                                            {/* Pill categoria mini (colorata) */}
                                            {t.category?.name ? (
                                                <span
                                                    className="shrink-0 text-[10px] leading-none px-2 py-1 rounded-full border border-bg-elevate"
                                                    style={{
                                                        backgroundColor: `${categoryColor}22`,
                                                        color: categoryColor,
                                                    }}
                                                    title={t.category.name}
                                                >
                                                    {t.category.name}
                                                </span>
                                            ) : (
                                                <span className="shrink-0 text-[10px] leading-none px-2 py-1 rounded-full border border-bg-elevate text-muted-foreground">
                                                    Senza categoria
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-0.5 text-[11px] text-muted-foreground flex items-center gap-2">
                                            <span>{formatDate(String(t.date))}</span>

                                            {/* Selection hint */}
                                            {isSelectionMode && (
                                                <span className="opacity-80">
                                                    {selectedIds.includes(t.id) ? "Selezionata" : "Tocca per aprire"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Importo a destra (verde/rosso) */}
                                    <div
                                        className="shrink-0 font-bold text-sm tabular-nums"
                                        style={{ color: amountColor }}
                                    >
                                        {formatAmount(Number(t.amount))}
                                    </div>
                                </div>
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
Come:
- Desktop: filtro laterale + tabella.
- Mobile: lista “dense” stile tabella, con divider compatti per ANNO e MESE.
- Divider ANNO/MESE mostrano esplicitamente: Entrate, Spese, Saldo (etichette chiare).
- Tipo transazione dedotto robusto: category.type -> tx.type -> fallback "spesa".
- Importo e icona: verde per entrata, rosso per spesa.
- Barra sinistra: colore categoria.
*/
