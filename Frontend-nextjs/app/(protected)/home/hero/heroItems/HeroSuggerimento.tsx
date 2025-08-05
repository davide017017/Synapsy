"use client";

import { useState } from "react";
import { heroSuggestions } from "./heroSuggestions";

// ======================================================================
// HeroSuggerimento — suggerimenti, motivazioni e consigli d’uso
// ======================================================================
export default function HeroSuggerimento() {
    const suggestions = heroSuggestions;

    // ── Indice del suggerimento corrente ──
    const [index, setIndex] = useState(() => Math.floor(Math.random() * suggestions.length));

    // ── Funzione per cambiare suggerimento (senza ripetere subito lo stesso) ──
    const getNewIndex = () => {
        let newIndex = Math.floor(Math.random() * suggestions.length);
        while (suggestions.length > 1 && newIndex === index) {
            newIndex = Math.floor(Math.random() * suggestions.length);
        }
        return newIndex;
    };

    // ── Handler bottone ──
    const handleNext = () => {
        setIndex(getNewIndex());
    };

    return (
        <div className="px-4 text-center">
            {/* Titolo */}
            <h2 className="text-lg font-bold mb-2">Suggerimento 🌱</h2>

            {/* Suggerimento principale */}
            <p className="text-base min-h-[40px]">{suggestions[index]}</p>

            {/* Bottone nuovo suggerimento */}
            <button
                className="mt-3 px-4 py-1 rounded-xl bg-emerald-400 text-white font-semibold shadow transition hover:bg-emerald-500 active:scale-95"
                onClick={handleNext}
                title="Mostra un nuovo suggerimento"
            >
                Nuovo suggerimento
            </button>

            {/* Nota */}
            <p className="text-sm text-gray-500 mt-2">
                (Presto arriveranno suggerimenti ancora più personalizzati!)
            </p>
        </div>
    );
}
