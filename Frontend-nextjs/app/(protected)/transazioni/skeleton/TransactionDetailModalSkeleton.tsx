// app/(protected)/panoramica/components/skeleton/TransactionDetailModalSkeleton.tsx
"use client";

import Skeleton from "@/app/components/ui/Skeleton";

export default function TransactionDetailModalSkeleton() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-lg animate-pulse">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-16 w-full mb-6" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}

