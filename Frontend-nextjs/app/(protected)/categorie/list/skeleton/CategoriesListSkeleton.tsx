"use client";
import Skeleton from "@/app/components/ui/Skeleton";

export default function CategoriesListSkeleton() {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <li key={i} className="p-4 rounded-2xl border border-bg-elevate bg-bg-elevate/60 shadow-md space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

