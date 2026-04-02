"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, List, CalendarCheck, Folder, Plus } from "lucide-react";
import { useTransactions } from "@/context/TransactionsContext";

// ─────────────────────────────────────────
// CONFIG TAB
// ─────────────────────────────────────────
const TABS = [
    { href: "/panoramica", label: "Panoramica", Icon: BarChart2, col: 0 },
    { href: "/transazioni", label: "Transazioni", Icon: List, col: 1 },
    { href: "/ricorrenti", label: "Ricorrenti", Icon: CalendarCheck, col: 3 },
    { href: "/categorie", label: "Categorie", Icon: Folder, col: 4 },
];

// ─────────────────────────────────────────
// NOTCH PATH (simmetrico smooth)
// ─────────────────────────────────────────
const NOTCH_PATH = "M 0 0 C 20 0 20 40 50 40 C 80 40 80 0 100 0";

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function BottomNav() {
    const pathname = usePathname();
    const { openModal } = useTransactions();

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    const activeTab = TABS.find((t) => isActive(t.href));

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg h-16 overflow-visible">
            {/* ─────────────────────────────────────────
          BORDER FULL WIDTH (LINEA REALE)
      ───────────────────────────────────────── */}
            <div className="absolute inset-x-0 top-0 h-px bg-border" />

            {/* ─────────────────────────────────────────
          NOTCH (overlay sopra il bordo)
      ───────────────────────────────────────── */}
            <div className="absolute inset-x-0 top-0 h-16 pointer-events-none overflow-visible">
                <svg viewBox="0 0 500 60" preserveAspectRatio="none" className="w-full h-full">
                    {/* LINEA COMPLETA */}
                    <line x1="0" y1="0" x2="500" y2="0" stroke="hsl(var(--c-border))" strokeWidth="1.5" />

                    {/* NOTCH */}
                    {activeTab && (
                        <g transform={`translate(${activeTab.col * 100}, 0)`}>
                            {/* copertura */}
                            <path d={NOTCH_PATH} fill="hsl(var(--c-bg))" />

                            {/* bordo notch */}
                            <path
                                d={NOTCH_PATH}
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                stroke="hsl(var(--c-border))"
                                strokeWidth="1.5"
                            />

                            {/* glow */}
                            <path
                                d={NOTCH_PATH}
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                stroke="hsl(var(--c-primary))"
                                strokeWidth="4"
                                opacity="0.12"
                            />
                        </g>
                    )}
                </svg>
            </div>

            {/* ─────────────────────────────────────────
          TAB
      ───────────────────────────────────────── */}
            <div className="flex items-end h-full">
                <NavTab tab={TABS[0]} active={isActive(TABS[0].href)} />
                <NavTab tab={TABS[1]} active={isActive(TABS[1].href)} />

                {/* ───── ➕ CENTRALE ───── */}
                <div className="flex-1 flex items-end justify-center pb-2">
                    <button
                        onClick={() => openModal()}
                        aria-label="Nuova transazione"
                        className="
              flex items-center justify-center
              w-14 h-14 rounded-full
              bg-primary hover:bg-primary-light active:bg-primary-dark
              shadow-[0_4px_20px_hsl(var(--c-primary)/0.45)]
              transition-all duration-150 active:scale-95
              -translate-y-3
            "
                    >
                        <Plus size={28} strokeWidth={2.5} className="text-text-invert" />
                    </button>
                </div>

                <NavTab tab={TABS[2]} active={isActive(TABS[2].href)} />
                <NavTab tab={TABS[3]} active={isActive(TABS[3].href)} />
            </div>
        </nav>
    );
}

// ─────────────────────────────────────────
// TAB COMPONENT
// ─────────────────────────────────────────
function NavTab({ tab, active }: { tab: (typeof TABS)[number]; active: boolean }) {
    return (
        <Link
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-end pb-1.5 gap-0.5"
        >
            {/* ───── ICON ───── */}
            <div
                className={[
                    "flex items-center justify-center rounded-full",
                    "transition-all duration-300 ease-in-out",
                    active
                        ? "w-11 h-11 bg-primary/20 shadow-[0_4px_16px_hsl(var(--c-primary)/0.35)] -translate-y-3 text-primary"
                        : "w-8 h-8 text-text-tertiary hover:text-text-secondary",
                ].join(" ")}
            >
                <tab.Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            </div>

            {/* ───── LABEL ───── */}
            <span
                className={[
                    "text-[10px] font-medium transition-colors duration-200",
                    active ? "text-primary" : "text-text-tertiary",
                ].join(" ")}
            >
                {tab.label}
            </span>
        </Link>
    );
}
