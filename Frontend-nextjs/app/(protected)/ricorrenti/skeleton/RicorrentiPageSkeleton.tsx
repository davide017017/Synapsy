"use client";
import Skeleton from "@/app/components/ui/Skeleton";

export default function RicorrentiPageSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-bg-elevate bg-bg-elevate/60 shadow-md space-y-4">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-bg-elevate bg-bg-elevate/60 shadow-md space-y-3">
                        <Skeleton className="h-5 w-1/3" />
                        {[...Array(3)].map((_, j) => (
                            <Skeleton key={j} className="h-4 w-full" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
