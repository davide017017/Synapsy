import { ReactNode } from "react";
import type { DashboardCardProps } from "@/types";
import Link from "next/link";

// ╔══════════════════════════════════════╗
// ║  DashboardCard                      ║
// ║  Card generica con icona, titolo... ║
// ╚══════════════════════════════════════╝

export default function DashboardCard({ icon, title, value, children, href }: DashboardCardProps) {
    // Stili base
    const className = [
        "flex flex-col gap-2 p-4 rounded-xl min-h-[120px]",
        "border border-gray-200 dark:border-zinc-700",
        "bg-[hsl(var(--c-bg))]",
        "shadow-black shadow-lg transition-all duration-150",
        href
            ? "cursor-pointer hover:shadow-black hover:shadow-2xl hover:bg-primary/10 active:shadow-md active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-primary"
            : "",
    ].join(" ");

    // Card content
    const cardContent = (
        <div className={className} tabIndex={href ? 0 : -1}>
            <div className="flex items-center gap-2 text-primary font-semibold">
                {icon}
                {title}
            </div>
            {value !== undefined && <div className="text-2xl font-bold">{value}</div>}
            {children && <div className="text-xs text-gray-500 dark:text-gray-400">{children}</div>}
        </div>
    );

    // Wrapper con link se href presente
    return href ? (
        <Link href={href} tabIndex={-1} className="block">
            {cardContent}
        </Link>
    ) : (
        cardContent
    );
}

