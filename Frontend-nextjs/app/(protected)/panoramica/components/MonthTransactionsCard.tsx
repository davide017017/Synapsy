"use client";

// ╔═══════════════════════════════════════════════════════════════╗
// ║ MonthTransactionsCard.tsx — Lista transazioni del mese         ║
// ╚═══════════════════════════════════════════════════════════════╝

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import type { Transaction } from "@/types/models/transaction";
import { eur } from "@/utils/formatCurrency";
import { parseYMD, toNum, typeOf } from "@/lib/finance";

type MonthTransactionsCardProps = {
    transactions: Transaction[];
    viewMonth: number;
    viewYear: number;
};

type SortKey = "importo" | "data";
type SortDir = "desc" | "asc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "importo", label: "Importo" },
    { key: "data", label: "Data" },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function MonthTransactionsCard({ transactions, viewMonth, viewYear }: MonthTransactionsCardProps) {
    const [sortKey, setSortKey] = useState<SortKey>("importo");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const handlePillClick = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const monthTx = useMemo(() => {
        const filtered = transactions.filter((t) => {
            const d = parseYMD(t.date);
            return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
        });

        const sorted = [...filtered];
        const sign = sortDir === "desc" ? -1 : 1;

        if (sortKey === "data") {
            return sorted.sort((a, b) => sign * (parseYMD(a.date).getTime() - parseYMD(b.date).getTime()));
        }
        return sorted.sort((a, b) => sign * (toNum(a.amount) - toNum(b.amount)));
    }, [transactions, viewMonth, viewYear, sortKey, sortDir]);

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            {/* ── Title row ───────────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <ArrowDownUp className="w-3.5 h-3.5 text-foreground/60" />
                <span className="font-mono uppercase text-xs text-foreground/60">Transazioni del mese</span>
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

            {/* ── Count summary ───────────────────────────────────── */}
            <div className="font-mono text-[10px] text-foreground/40 mt-1">{monthTx.length} transazioni</div>

            {/* ── Transaction rows ─────────────────────────────────── */}
            {monthTx.length > 0 ? (
                <div className="flex flex-col gap-0.5 mt-2">
                    {monthTx.map((t) => {
                        const d = parseYMD(t.date);
                        const dateLabel = `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
                        const catColor = t.category?.color || "#ccc";
                        const catName = t.category?.name || "Nessuna categoria";
                        const isEntrata = typeOf(t) === "entrata";

                        return (
                            <div
                                key={t.id}
                                className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-white/5"
                            >
                                <span className="font-mono text-[9px] text-foreground/35 w-10 shrink-0">
                                    {dateLabel}
                                </span>
                                <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: catColor }}
                                />
                                <span className="font-mono text-[11px] truncate flex-1 text-foreground/80">
                                    {t.description}
                                </span>
                                <span className="font-mono text-[9px] text-foreground/40 truncate max-w-[5rem] hidden sm:block">
                                    {catName}
                                </span>
                                <span
                                    className={`font-mono text-[11px] font-bold shrink-0 ${
                                        isEntrata ? "text-primary" : "text-orange-400"
                                    }`}
                                >
                                    {isEntrata ? "+" : "–"}
                                    {eur(toNum(t.amount))}
                                </span>
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
