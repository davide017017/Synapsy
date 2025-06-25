// app/(protected)/panoramica/components/skeleton/TransactionsListSkeleton.tsx
"use client";

export default function TransactionsListSkeleton() {
    return (
        <ul className="space-y-1 mt-4">
            {[...Array(8)].map((_, i) => (
                <li key={i} className="h-10 bg-gray-800 rounded-md animate-pulse flex items-center px-4">
                    <div className="h-4 w-32 bg-gray-700 rounded mr-3" />
                    <div className="h-4 w-16 bg-gray-700 rounded ml-auto" />
                </li>
            ))}
        </ul>
    );
}
