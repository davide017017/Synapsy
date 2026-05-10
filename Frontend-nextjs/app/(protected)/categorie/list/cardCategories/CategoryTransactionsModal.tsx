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
        <div className="flex items-center gap-2 min-w-0 font-mono uppercase tracking-[0.10em]">
            {Icon && (
                <Icon style={{ color: accent }} className="shrink-0 drop-shadow-[0_0_10px_currentColor]" size={18} />
            )}

            <span className="font-bold text-sm truncate" style={{ color: accent }}>
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
            className="
            px-4 py-1.5
            rounded-xl
            border
            font-mono
            text-[11px]
            uppercase
            tracking-[0.08em]
            transition-all duration-200
            hover:bg-primary/10
            hover:text-primary
            active:scale-95
        "
            style={{
                background: "hsl(var(--c-bg-elevate, 230 17% 21%) / 0.65)",
                borderColor: "hsl(var(--c-primary) / 0.20)",
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
                        className="
                            flex items-center gap-1.5
                            px-3 py-1.5
                            rounded-xl
                            border
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-[0.08em]
                            transition-all duration-200
                            hover:shadow-[0_0_14px_currentColor]
                            active:scale-95
                        "
                        style={{
                            background: `${accent}1f`,
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
                    <p
                        className="
                          py-6
                          text-center
                          font-mono
                          text-[11px]
                          uppercase
                          tracking-[0.10em]
                          text-foreground/40
                      "
                    >
                        Nessuna transazione per questa categoria.
                    </p>
                ) : (
                    <ul className="space-y-1">
                        {" "}
                        {txList.map((tx) => {
                            const isIncome = tx.type === "entrata";
                            const amountColor = isIncome ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";
                            return (
                                <li
                                    key={tx.id}
                                    className="
                                        flex items-center gap-2
                                        px-2 py-2
                                        rounded-xl
                                        border border-white/10
                                        bg-black/10
                                        backdrop-blur-sm
                                        transition-colors
                                        hover:bg-primary/5
                                    "
                                >
                                    {/* Data */}
                                    <span className="font-mono text-[10px] text-foreground/40 w-[72px] shrink-0 tabular-nums">
                                        {formatDate(tx.date)}
                                    </span>

                                    {/* Descrizione */}
                                    <span className="flex-1 font-mono text-[12px] text-foreground/75 truncate min-w-0">
                                        {tx.description}
                                    </span>

                                    {/* Importo */}
                                    <span
                                        className="shrink-0 font-mono text-[12px] font-bold tabular-nums"
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
