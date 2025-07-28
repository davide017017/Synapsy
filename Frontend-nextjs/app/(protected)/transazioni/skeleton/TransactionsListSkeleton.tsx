// app/(protected)/panoramica/components/skeleton/TransactionsListSkeleton.tsx
"use client";

import Skeleton from "@/app/components/ui/Skeleton";

export default function TransactionsListSkeleton() {
    return (
        <ul className="space-y-1 mt-4">
            {[...Array(8)].map((_, i) => (
                <li key={i} className="h-10 rounded-md flex items-center px-4">
                    <Skeleton className="h-4 w-32 mr-3" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                </li>
            ))}
        </ul>
    );
}
