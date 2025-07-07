import { ReactNode } from "react";
import Link from "next/link";

type Props = {
    icon: ReactNode;
    title: string;
    value: ReactNode;
    children?: ReactNode;
    href?: string;
};

export default function DashboardCard({ icon, title, value, children, href }: Props) {
    // Utility Tailwind pura, nessun colore custom!
    const className = [
        "flex flex-col gap-2 p-4 rounded-xl min-h-[120px]",
        "border border-gray-200 dark:border-zinc-700",
        "bg-[hsl(var(--c-bg))]",
        "shadow-black shadow-lg transition-all duration-150",
        href
            ? "cursor-pointer hover:shadow-black hover:shadow-2xl hover:bg-primary/10 active:shadow-md active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-primary"
            : "",
    ].join(" ");

    const cardContent = (
        <div className={className} tabIndex={href ? 0 : -1}>
            <div className="flex items-center gap-2 text-primary font-semibold">
                {icon} {title}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {children && <div className="text-xs text-gray-500 dark:text-gray-400">{children}</div>}
        </div>
    );

    return href ? (
        <Link href={href} tabIndex={-1} className="block">
            {cardContent}
        </Link>
    ) : (
        cardContent
    );
}
