"use client";

// ============================
// CardTotaliAnnui.tsx
// Card: mostra il riepilogo annuale delle spese ricorrenti per frequenza
// ============================

import { frequenzaOrder } from "../utils/ricorrenza-utils";
import { Repeat } from "lucide-react";

// ----------------------------
// Tipi delle props
// ----------------------------
type Props = {
    totaliAnnui: Record<string, number>;
    totaleAnnuale: number;
};

// ----------------------------
// Componente principale
// ----------------------------
export default function CardTotaliAnnui({ totaliAnnui, totaleAnnuale }: Props) {
    // Ordina le frequenze secondo l’ordine logico
    function ordinaFrequenza(a: string, b: string) {
        return (
            (frequenzaOrder[a as keyof typeof frequenzaOrder] ?? 99) -
            (frequenzaOrder[b as keyof typeof frequenzaOrder] ?? 99)
        );
    }

    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex flex-col gap-2 shadow-md min-h-[108px]">
            {/* ---------- Titolo Card ---------- */}
            <div className="flex items-center gap-2 text-2xl font-bold">
                <Repeat className="w-7 h-7 text-primary" />
                Spese ricorrenti
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Riepilogo spesa annuale stimata per ogni frequenza:
            </div>

            {/* ---------- Totali per frequenza ---------- */}
            <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
                {Object.entries(totaliAnnui)
                    .sort(([freqA], [freqB]) => ordinaFrequenza(freqA, freqB))
                    .map(([freq, tot]) => (
                        <div
                            key={freq}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-xl flex items-center gap-1"
                        >
                            <span>{freq}:</span>
                            <span className="font-mono">€ {tot.toFixed(2)}/anno</span>
                        </div>
                    ))}
            </div>

            {/* ---------- Totale generale annuo ---------- */}
            <div className="mt-4 px-3 py-2 rounded-xl bg-primary/20 text-primary font-extrabold text-lg border border-primary/50 flex items-center gap-2 self-end">
                Totale annuo:&nbsp;
                <span className="font-mono">€ {totaleAnnuale.toFixed(2)}</span>
            </div>
        </div>
    );
}

// ============================
// END CardTotaliAnnui.tsx
// ============================
