"use client";

import HeroCarousel from "./hero/HeroCarousel";
import TransazioniCard from "./cards/TransazioniCard";
import RicorrentiCard from "./cards/RicorrentiCard";
import CategorieCard from "./cards/CategorieCard";
import ProssimoPagamentoCard from "./cards/ProssimoPagamentoCard";
import PanoramicaCard from "./cards/PanoramicaCard";
import UltimiMesiCard from "./cards/UltimiMesiCard";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";
import NewCategoryButton from "../newCategory/NewCategoryButton";

// ─────────────────────────────────────────
// HomePage: layout come CategoriesPage
// ─────────────────────────────────────────
export default function HomePage() {
    return (
        <div className="px-2 md:px-6 space-y-2">
            {/* Hero / carosello */}
            <HeroCarousel />

            {/* Bottoni azione */}
            <div className="flex gap-2 justify-center">
                <NewTransactionButton />
                <NewRicorrenzaButton />
                <NewCategoryButton />
            </div>

            {/* Mobile/tablet layout (below lg) */}
            <div className="flex flex-col gap-4 w-full lg:hidden">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4 items-stretch">
                    <PanoramicaCard />
                    <TransazioniCard />
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-4 items-stretch">
                    <RicorrentiCard />
                    <ProssimoPagamentoCard />
                </div>
                {/* Row 3 */}
                <CategorieCard />
                {/* Row 4 */}
                <UltimiMesiCard />
            </div>

            {/* Desktop layout (lg+) */}
            <div className="hidden lg:grid grid-cols-4 gap-4 w-full">
                <TransazioniCard />
                <RicorrentiCard />
                <CategorieCard />
                <ProssimoPagamentoCard />
            </div>
            <div className="hidden lg:block w-full">
                <UltimiMesiCard />
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
