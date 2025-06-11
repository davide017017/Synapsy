// app/(protected)/riepilogo/page.tsx
"use client";

import CalendarGrid from "@/app/(protected)/riepilogo/components/CalendarGrid";

export default function RiepilogoPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">📅 Riepilogo con Calendario</h1>
            <CalendarGrid />
        </div>
    );
}
