"use client";
import Skeleton from "@/app/components/ui/Skeleton";

// Stessa struttura del layout denso: header, barra, tab, righe, footer
export default function RicorrentiPageSkeleton() {
    return (
        <div className="mx-auto max-w-3xl space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
            <div className="rounded-xl border border-bg-elevate bg-bg-elevate/60 p-2 space-y-1.5">
                <Skeleton className="h-5 w-1/3" />
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-[26px] w-full" />
                ))}
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
        </div>
    );
}
