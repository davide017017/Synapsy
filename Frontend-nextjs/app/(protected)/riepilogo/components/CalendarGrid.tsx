// app/(protected)/riepilogo/components/CalendarGrid.tsx
"use client";

export default function CalendarGrid() {
    return (
        <div className="grid grid-cols-7 gap-2">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="h-20 bg-white dark:bg-zinc-800 shadow rounded p-1">
                    Giorno {i + 1}
                </div>
            ))}
        </div>
    );
}
