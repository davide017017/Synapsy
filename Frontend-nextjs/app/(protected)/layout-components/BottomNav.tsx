"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, List, CalendarCheck, Folder } from "lucide-react";
import { useTransactions } from "@/context/TransactionsContext";

const TABS = [
    { href: "/panoramica", label: "Panoramica", Icon: BarChart2 },
    { href: "/transazioni", label: "Transazioni", Icon: List },
    { href: "/ricorrenti", label: "Ricorrenti", Icon: CalendarCheck },
    { href: "/categorie", label: "Categorie", Icon: Folder },
];

export default function BottomNavModern() {
    const pathname = usePathname();
    const { openModal } = useTransactions();

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    const activeIndex = TABS.findIndex((t) => isActive(t.href));

    return (
        <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            {/* CONTAINER GLASS */}
            <div
                className="
        relative
        w-[92%] max-w-md
        h-16
        rounded-2xl
        backdrop-blur-xl
        bg-white/5
        border border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        flex items-center
        px-2
      "
            >
                {/* ACTIVE PILL — solo se il path corrente è uno dei tab */}
                {activeIndex >= 0 && (
                    <div
                        className="
                      absolute top-1 bottom-1
                      rounded-xl
                      bg-primary/20
                      shadow-[0_0_20px_hsl(var(--c-primary)/0.35)]
                      transition-all duration-300 ease-in-out
                    "
                        style={{
                            width: `${100 / TABS.length}%`,
                            left: `${(100 / TABS.length) * activeIndex}%`,
                        }}
                    />
                )}

                {/* TABS */}
                {TABS.map((tab, i) => {
                    const active = i === activeIndex;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="
                relative z-10
                flex-1 flex flex-col items-center justify-center
                transition-all duration-300
              "
                        >
                            <div
                                className={[
                                    "flex flex-col items-center justify-center gap-1",
                                    active ? "text-primary scale-105" : "text-white/50 hover:text-white/80",
                                ].join(" ")}
                            >
                                <tab.Icon
                                    size={22}
                                    strokeWidth={active ? 2.6 : 1.8}
                                    className={active ? "drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" : ""}
                                />

                                <span className="text-[10px] font-medium">{tab.label}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* FAB CENTRALE — z-20 > z-10 dei tab link, altrimenti i tab intercettano i click */}
                <button
                    onClick={() => openModal()}
                    aria-label="Aggiungi transazione"
                    className="
            absolute left-1/2 -translate-x-1/2 -top-9
            z-20
            w-14 h-14
            flex items-center justify-center
            transition-transform duration-200
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2
            focus-visible:ring-offset-transparent
            rounded-lg
          "
                >
                    {/* halo radiale */}
                    <span
                        aria-hidden
                        className="absolute inset-[-14px] rounded-full pointer-events-none"
                        style={{
                            background: "radial-gradient(circle, hsl(var(--c-primary) / 0.40) 0%, transparent 65%)",
                        }}
                    />
                    {/* braccio orizzontale */}
                    <span
                        aria-hidden
                        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-primary rounded-lg"
                        style={{
                            height: "16px",
                            filter: "drop-shadow(0 0 18px hsl(var(--c-primary) / 0.55))",
                        }}
                    />
                    {/* braccio verticale */}
                    <span
                        aria-hidden
                        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 bg-primary rounded-lg"
                        style={{
                            width: "16px",
                            filter: "drop-shadow(0 0 18px hsl(var(--c-primary) / 0.55))",
                        }}
                    />
                </button>
            </div>
        </div>
    );
}
