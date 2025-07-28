// app/(protected)/panoramica/components/skeleton/CalendarGridSkeleton.tsx
"use client";

import Skeleton from "@/app/components/ui/Skeleton";

export default function CalendarGridSkeleton() {
    return (
        <div className="grid grid-cols-7 gap-2 mb-6">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="h-20 rounded flex flex-col justify-center items-center">
                    <Skeleton className="h-5 w-12 mb-2" />
                    <Skeleton className="h-3 w-8" />
                </div>
            ))}
        </div>
    );
}
