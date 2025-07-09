// app/(protected)/home/hero/heroItems/HeroSuggerimento.tsx
"use client";

import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// HeroSuggerimento — placeholder per suggerimenti finanziari
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSuggerimento() {
    // ── Lista di suggerimenti di esempio ──
    const suggestions = useMemo(
        () => [
            "Imposta un budget settimanale per le spese superflue.",
            "Automatizza un trasferimento mensile al tuo conto risparmio.",
            "Rivedi le tariffe degli abbonamenti e cancella quelli inutilizzati.",
            "Confronta le offerte di carte cashback ogni trimestre.",
        ],
        []
    );

    // ── Seleziona un suggerimento casuale ──
    const tip = suggestions[Math.floor(Math.random() * suggestions.length)];

    return (
        <div className="px-4 text-center">
            {/* Titolo */}
            <h2 className="text-lg font-bold mb-2">Suggerimento 🌱</h2>

            {/* Suggerimento principale */}
            <p className="text-base ">{tip}</p>

            {/* Nota che è un placeholder */}
            <p className="text-sm text-gray-500 mt-2">
                (Placeholder — presto qui arriveranno suggerimenti personalizzati!)
            </p>
        </div>
    );
}
