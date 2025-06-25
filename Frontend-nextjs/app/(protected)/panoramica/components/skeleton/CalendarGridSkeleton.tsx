// app/(protected)/panoramica/components/skeleton/CalendarGridSkeleton.tsx
"use client";

export default function CalendarGridSkeleton() {
    return (
        <div className="grid grid-cols-7 gap-2 mb-6">
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="h-20 bg-gray-800 rounded animate-pulse flex flex-col justify-center items-center"
                >
                    <div className="h-5 w-12 bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-8 bg-gray-700 rounded" />
                </div>
            ))}
        </div>
    );
}
