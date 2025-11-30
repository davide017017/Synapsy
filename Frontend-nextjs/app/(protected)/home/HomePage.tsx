"use client";

import HeroCarousel from "./hero/HeroCarousel";
import TransazioniCard from "./cards/TransazioniCard";
import RicorrentiCard from "./cards/RicorrentiCard";
import CategorieCard from "./cards/CategorieCard";
import ProssimoPagamentoCard from "./cards/ProssimoPagamentoCard";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";
import NewCategoryButton from "../newCategory/NewCategoryButton";
import { useRenderTimer } from "./utils/useRenderTimer";

// ─────────────────────────────────────────
// HomePage: layout come CategoriesPage
// ─────────────────────────────────────────
export default function HomePage() {
    useRenderTimer("HomePage");

    return (
        <div className="px-2 md:px-6 pt-6 pb-12 space-y-6">
            {/* Hero / carosello */}
            <HeroCarousel />

            {/* Bottoni azione */}
            <div className="flex flex-wrap gap-3 justify-center">
                <NewTransactionButton />
                <NewRicorrenzaButton />
                <NewCategoryButton />
            </div>

            {/* Griglia card riassuntive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <TransazioniCard />
                <RicorrentiCard />
                <CategorieCard />
                <ProssimoPagamentoCard />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// File: HomePage.tsx
// Serve: dashboard principale.
// Come: wrapper con padding come Categories,
//       HeroCarousel full-width ma con slide
//       max-w-xl, griglia 1–2–4 colonne.
// ─────────────────────────────────────────────
