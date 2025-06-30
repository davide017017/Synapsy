"use client";
// ============================
// AreaGraficiRicorrenze.tsx
// ============================
import { BarChart } from "lucide-react";

export default function AreaGraficiRicorrenze() {
    return (
        <div className="mt-8 flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2 mb-2">
                <BarChart className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">Andamento ricorrenze (grafici in arrivo)</span>
            </div>
            <div className="w-full h-32 flex items-center justify-center rounded-xl border border-dashed border-zinc-400 text-zinc-400 bg-zinc-100 dark:bg-zinc-900/30">
                <span>… grafici in arrivo …</span>
            </div>
        </div>
    );
}
