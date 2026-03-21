"use client";

// ============================================================
// CategoryTransactionsModal — consulto rapido tx per categoria
// ============================================================

import { useRouter } from "next/navigation";
import { Telescope } from "lucide-react";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import { useTransactions } from "@/context/TransactionsContext";
import { getIconComponent } from "@/utils/categoryOptions";
import { eur } from "@/utils/formatCurrency";
import type { Category } from "@/types";

// ----------- Props -----------
type Props = {
    cat: Category | null;
    onClose: () => void;
};

// ----------- Helper: formatta YYYY-MM-DD → dd/MM/yyyy -----------
function formatDate(dateStr: string): string {
    const s = String(dateStr);
    const y = s.slice(0, 4);
    const m = s.slice(5, 7);
    const d = s.slice(8, 10);
    if (y && m && d) return `${d}/${m}/${y}`;
    try {
        return new Intl.DateTimeFormat("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateStr));
    } catch {
        return dateStr;
    }
}

// ============================================================
// Componente principale
// ============================================================
export default function CategoryTransactionsModal({ cat, onClose }: Props) {
    const { transactions } = useTransactions();
    const router = useRouter();

    // ── Lista filtrata e ordinata ────────────────────────────
    const txList = cat
        ? transactions
              .filter((t) => t.category_id === cat.id || t.category?.id === cat.id)
              .sort((a, b) => (a.date < b.date ? 1 : -1))
        : [];

    // ── Header: icona + nome categoria ──────────────────────
    const Icon = cat ? getIconComponent(cat.icon) : null;
    const accent = cat?.color || "hsl(var(--c-primary))";

    const titleNode = cat ? (
        <div className="flex items-center gap-2 min-w-0">
            {Icon && <Icon style={{ color: accent }} className="shrink-0" />}
            <span
                className="font-bold text-base truncate"
                style={{ color: accent }}
            >
                {cat.name}
            </span>
        </div>
    ) : null;

    // ── Navigazione a /transazioni con filtro pre-impostato ──
    const handleNavigate = () => {
        if (!cat) return;
        sessionStorage.setItem("filterCategory", String(cat.id));
        onClose();
        router.push("/transazioni");
    };

    // ── Footer ───────────────────────────────────────────────
    const footer = (
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-sm font-medium border transition hover:brightness-110"
            style={{
                background: "hsl(var(--c-bg-elevate, 230 17% 21%))",
                borderColor: "hsl(var(--c-primary-border, 159 68% 54% / 0.25))",
                color: "hsl(var(--c-text-secondary, 220 12% 70%))",
            }}
        >
            Chiudi
        </button>
    );

    // ── Render ───────────────────────────────────────────────
    return (
        <Dialog open={!!cat} onClose={onClose}>
            <ModalLayout title={titleNode} onClose={onClose} footer={footer}>
                {/* Bottone Telescope — vai alle transazioni filtrate */}
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        onClick={handleNavigate}
                        title="Vai alle transazioni filtrate per questa categoria"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition hover:brightness-110"
                        style={{
                            background: `${accent}22`,
                            borderColor: `${accent}44`,
                            color: accent,
                        }}
                    >
                        <Telescope size={14} />
                        Vedi tutto
                    </button>
                </div>

                {/* Lista transazioni */}
                {txList.length === 0 ? (
                    <p className="text-sm text-center opacity-60 py-6">
                        Nessuna transazione per questa categoria.
                    </p>
                ) : (
                    <ul className="divide-y divide-[hsl(var(--c-table-divider,220_12%_25%/0.3))]">
                        {txList.map((tx) => {
                            const isIncome = tx.type === "entrata";
                            const amountColor = isIncome
                                ? "hsl(var(--c-success))"
                                : "hsl(var(--c-danger))";
                            return (
                                <li
                                    key={tx.id}
                                    className="flex items-center gap-2 py-1.5"
                                >
                                    {/* Data */}
                                    <span className="text-xs opacity-60 w-[72px] shrink-0 tabular-nums">
                                        {formatDate(tx.date)}
                                    </span>

                                    {/* Descrizione */}
                                    <span className="flex-1 text-sm truncate min-w-0">
                                        {tx.description}
                                    </span>

                                    {/* Importo */}
                                    <span
                                        className="shrink-0 font-mono text-sm font-semibold tabular-nums"
                                        style={{ color: amountColor }}
                                    >
                                        {isIncome ? "+" : "−"}
                                        {eur(tx.amount)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </ModalLayout>
        </Dialog>
    );
}
