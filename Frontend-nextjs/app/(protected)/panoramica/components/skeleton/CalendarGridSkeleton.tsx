// app/(protected)/panoramica/components/skeleton/CalendarGridSkeleton.tsx
"use client";

import Skeleton from "@/app/components/ui/Skeleton";

export default function CalendarGridSkeleton() {
    // simuliamo sempre 35 celle (5 settimane), che è il minimo per un mese intero
    const totalCells = 35;

    return (
        <div
            className={`
                grid gap-2
                grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[auto_repeat(7,_1fr)]
                min-h-[370px]
            `}
        >
            {[...Array(totalCells)].map((_, i) => (
                <div
                    key={i}
                    className="h-20 rounded-lg border border-white/10 bg-white/5 flex flex-col items-center justify-between p-1 animate-pulse"
                >
                    {/* Giorno (in alto) */}
                    <Skeleton className="h-4 w-6 self-start" />

                    {/* Barre entrata/spesa */}
                    <div className="w-full flex flex-col gap-1">
                        <Skeleton className="h-2 w-3/4 mx-auto" />
                        <Skeleton className="h-2 w-1/2 mx-auto" />
                    </div>
                </div>
            ))}
        </div>
    );
}
