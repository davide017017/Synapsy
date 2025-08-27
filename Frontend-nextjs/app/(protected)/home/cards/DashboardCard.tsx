// app/(protected)/home/cards/DashboardCard.tsx
// ╔══════════════════════════════════════╗
// ║  DashboardCard                      ║
// ║  Card generica con icona, titolo... ║
// ╚══════════════════════════════════════╝

"use client";

import Link from "next/link";
import type { DashboardCardProps } from "@/types";

// ======================
// Component
// ======================
export default function DashboardCard({ icon, title, value, children, href, footer }: DashboardCardProps) {
    // ── Stili base ─────────────────────────────────────
    const className = [
        "flex flex-col gap-2 p-4 rounded-xl min-h-[120px]",
        "border border-gray-200 dark:border-zinc-700",
        "bg-[hsl(var(--c-bg))]",
        "shadow-black shadow-lg transition-all duration-150",
        href
            ? "cursor-pointer hover:shadow-black hover:shadow-2xl hover:bg-primary/10 active:shadow-md active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-primary"
            : "",
    ].join(" ");

    // ── Contenuto card ─────────────────────────────────
    const cardContent = (
        <div className={className} tabIndex={href ? 0 : -1}>
            {/* Header: icona + titolo */}
            <div className="flex items-center gap-2 text-primary font-semibold">
                {icon}
                {title}
            </div>

            {/* Valore grande (se presente) */}
            {value !== undefined && <div className="text-2xl font-bold">{value}</div>}

            {/* Body (children) */}
            {children && <div className="text-xs text-gray-500 dark:text-gray-400">{children}</div>}

            {/* Footer (nuovo, se presente) */}
            {footer && (
                <div className="mt-auto pt-2 text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-200/60 dark:border-zinc-700/60">
                    {footer}
                </div>
            )}
        </div>
    );

    // ── Wrapper link se href presente ──────────────────
    return href ? (
        <Link href={href} tabIndex={-1} className="block" aria-label={typeof title === "string" ? title : "Card"}>
            {cardContent}
        </Link>
    ) : (
        cardContent
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Card generica. Aggiunto supporto `footer?` per mostrare una riga inferiore
// separata (caption/nota). Mantiene href per card cliccabile e struttura
// semantica pulita.
// ----------------------------------------------------------------------
