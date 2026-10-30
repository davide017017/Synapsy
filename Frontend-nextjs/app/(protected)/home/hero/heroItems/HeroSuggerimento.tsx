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
                <h2 className="text-sm lg:text-lg font-bold mb-0.5 lg:mb-2">Suggerimento 🌱</h2>

                {/* Suggerimento attuale */}
                <p className="text-xs lg:text-base line-clamp-2 lg:line-clamp-none lg:min-h-[40px]">{heroSuggestions[index]}</p>

                {/* Bottone cambio suggerimento */}
                <button
                    onClick={next}
                    className="
                        mt-1 lg:mt-3 px-3 lg:px-4 py-0.5 lg:py-1 text-xs lg:text-base rounded-xl
                        bg-emerald-400 text-white font-semibold shadow
                        transition hover:bg-emerald-500 active:scale-95
                    "
                >
                    Nuovo suggerimento
                </button>

                <p className="hidden lg:block text-sm text-gray-500 mt-2">(Presto suggerimenti personalizzati!)</p>
            </div>
        </div>
    );
}
