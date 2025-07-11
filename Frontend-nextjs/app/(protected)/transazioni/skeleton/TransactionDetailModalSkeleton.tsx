// app/(protected)/panoramica/components/skeleton/TransactionDetailModalSkeleton.tsx
"use client";

export default function TransactionDetailModalSkeleton() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-lg animate-pulse">
                <div className="h-6 w-1/3 bg-gray-700 rounded mb-4" />
                <div className="h-4 w-2/3 bg-gray-700 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
                <div className="h-16 w-full bg-gray-800 rounded mb-6" />
                <div className="h-10 w-full bg-gray-700 rounded" />
            </div>
        </div>
    );
}
