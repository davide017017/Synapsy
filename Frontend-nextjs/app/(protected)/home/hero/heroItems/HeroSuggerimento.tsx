// HeroSuggerimento.tsx
// ======================================================================
// Componente che mostra un suggerimento casuale da heroSuggestions
// con possibilità di passare al successivo
// ======================================================================

"use client";

import { useState } from "react";
import { heroSuggestions } from "./heroSuggestions";

// ======================================================================
// Componente principale
// ======================================================================
export default function HeroSuggerimento() {
    // Stato indice suggerimento casuale iniziale
    const [index, setIndex] = useState(() => Math.floor(Math.random() * heroSuggestions.length));

    // Funzione per passare a un nuovo suggerimento
    const next = () => {
        let n = Math.floor(Math.random() * heroSuggestions.length);
        if (heroSuggestions.length > 1 && n === index) {
            n = (n + 1) % heroSuggestions.length;
        }
        setIndex(n);
    };

    return (
        <div className="flex flex-col h-full justify-center">
            <div className="px-4 text-center">
                <h2 className="text-lg font-bold mb-2">Suggerimento 🌱</h2>

                {/* Suggerimento attuale */}
                <p className="text-base min-h-[40px]">{heroSuggestions[index]}</p>

                {/* Bottone cambio suggerimento */}
                <button
                    onClick={next}
                    className="
                        mt-3 px-4 py-1 rounded-xl
                        bg-emerald-400 text-white font-semibold shadow
                        transition hover:bg-emerald-500 active:scale-95
                    "
                >
                    Nuovo suggerimento
                </button>

                <p className="text-sm text-gray-500 mt-2">(Presto suggerimenti personalizzati!)</p>
            </div>
        </div>
    );
}
