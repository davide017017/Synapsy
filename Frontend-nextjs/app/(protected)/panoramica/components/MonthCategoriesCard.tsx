"use client";

// ╔═══════════════════════════════════════════════════════════════╗
// ║ MonthCategoriesCard.tsx — Riepilogo categorie del mese        ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useMemo, useState } from "react";
import { Tag, ChevronDown } from "lucide-react";
import type { Transaction } from "@/types/models/transaction";
import { eur } from "@/utils/formatCurrency";
import { parseYMD, toNum } from "@/lib/finance";

type MonthCategoriesCardProps = {
    transactions: Transaction[];
    viewMonth: number;
    viewYear: number;
};

type CategoryAgg = {
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    categoryType: "entrata" | "spesa";
    count: number;
    total: number;
};

type SortKey = "importo" | "count";
type SortDir = "desc" | "asc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "importo", label: "Importo" },
    { key: "count", label: "Transazioni" },
];

export default function MonthCategoriesCard({ transactions, viewMonth, viewYear }: MonthCategoriesCardProps) {
    const [sortKey, setSortKey] = useState<SortKey>("importo");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

    const handlePillClick = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const monthTx = useMemo(() => {
        return transactions.filter((t) => {
            const d = parseYMD(t.date);
            return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
        });
    }, [transactions, viewMonth, viewYear]);

    const categories = useMemo(() => {
        const map = new Map<number, CategoryAgg>();
        for (const t of monthTx) {
            const cat = t.category;
            if (!cat) continue;

            const existing = map.get(cat.id);
            const amount = Math.abs(toNum(t.amount));

            if (existing) {
                existing.count += 1;
                existing.total += amount;
            } else {
                map.set(cat.id, {
                    categoryId: cat.id,
                    categoryName: cat.name,
                    categoryColor: cat.color,
                    categoryType: cat.type,
                    count: 1,
                    total: amount,
                });
            }
        }

        const list = [...map.values()];
        const sign = sortDir === "desc" ? -1 : 1;

        if (sortKey === "count") {
            return list.sort((a, b) => sign * (a.count - b.count));
        }
        return list.sort((a, b) => sign * (a.total - b.total));
    }, [monthTx, sortKey, sortDir]);

    const transactionsByCategory = useMemo(() => {
        const map = new Map<number, Transaction[]>();
        for (const t of monthTx) {
            if (!t.category) continue;
            const list = map.get(t.category.id);
            if (list) {
                list.push(t);
            } else {
                map.set(t.category.id, [t]);
            }
        }

        const sign = sortDir === "desc" ? -1 : 1;
        for (const list of map.values()) {
            list.sort((a, b) => sign * (Math.abs(toNum(a.amount)) - Math.abs(toNum(b.amount))));
        }

        return map;
    }, [monthTx, sortDir]);

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            {/* ── Title row ───────────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-foreground/60" />
                <span className="font-mono uppercase text-xs text-foreground/60">Categorie del mese</span>
            </div>

            {/* ── Sort pills ──────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-nowrap">
                {SORT_OPTIONS.map((opt) => {
                    const active = sortKey === opt.key;
                    return (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => handlePillClick(opt.key)}
                            className={`font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border cursor-pointer whitespace-nowrap transition-colors ${
                                active
                                    ? "border-primary bg-primary/20 text-primary"
                                    : "border-white/10 bg-white/5 text-foreground/50"
                            }`}
                        >
                            {opt.label}
                            {active && (sortDir === "desc" ? " ↓" : " ↑")}
                        </button>
                    );
                })}
            </div>

            {/* ── Category rows ───────────────────────────────────── */}
            {categories.length > 0 ? (
                <div className="flex flex-col gap-1 mt-2">
                    {categories.map((c) => {
                        const isOpen = openCategoryId === c.categoryId;
                        return (
                            <div key={c.categoryId}>
                                <div
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => setOpenCategoryId(isOpen ? null : c.categoryId)}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: c.categoryColor }}
                                    />
                                    <span className="font-mono text-[11px] truncate flex-1">{c.categoryName}</span>
                                    <span className="font-mono text-[9px] text-foreground/50">{c.count} tx</span>
                                    <span
                                        className="font-mono text-[11px] font-bold"
                                        style={{ color: c.categoryColor }}
                                    >
                                        {c.categoryType === "entrata" ? "+" : "–"}
                                        {eur(c.total)}
                                    </span>
                                    <ChevronDown
                                        className={`w-3 h-3 text-foreground/40 transition-transform duration-200 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>

                                {isOpen && (
                                    <div
                                        className="ml-4 mt-1 mb-2 border-l-2 pl-3"
                                        style={{ borderColor: `${c.categoryColor}55` }}
                                    >
                                        {(transactionsByCategory.get(c.categoryId) ?? []).map((t) => {
                                            const d = parseYMD(t.date);
                                            const day = String(d.getDate()).padStart(2, "0");
                                            const month = String(d.getMonth() + 1).padStart(2, "0");
                                            return (
                                                <div key={t.id} className="flex items-center gap-2 py-0.5">
                                                    <span className="font-mono text-[9px] text-foreground/35 w-10 shrink-0">
                                                        {day}/{month}
                                                    </span>
                                                    <span className="font-mono text-[11px] truncate flex-1 text-foreground/70">
                                                        {t.description}
                                                    </span>
                                                    <span
                                                        className="font-mono text-[11px] font-bold shrink-0"
                                                        style={{ color: c.categoryColor }}
                                                    >
                                                        {t.type === "entrata" ? "+" : "–"}
                                                        {eur(Math.abs(toNum(t.amount)))}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-foreground/40 text-xs py-4">Nessuna transazione questo mese</div>
            )}
        </div>
    );
}
