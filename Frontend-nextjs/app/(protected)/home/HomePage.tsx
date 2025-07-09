"use client";

// ===========================================
// HomePage.tsx — Dashboard migliorata Synapsi
// ===========================================

import HeroCarousel from "./hero/HeroCarousel"; // Carosello intro (da implementare)

import TransazioniCard from "./cards/TransazioniCard";
import RicorrentiCard from "./cards/RicorrentiCard";
import CategorieCard from "./cards/CategorieCard";
import ProssimoPagamentoCard from "./cards/ProssimoPagamentoCard";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";
import NewCategoryButton from "../newCategory/NewCategoryButton";

export default function HomePage() {
    return (
        <div className="space-y-8">
            {/* ====================== */}
            {/* HERO/CAROUSEL  */}
            {/* ====================== */}
            <div className="mb-4">
                <HeroCarousel />
            </div>

            {/* ====================== */}
            {/* BOTTONI AZIONE         */}
            {/* ====================== */}
            <div className="flex flex-wrap gap-3 justify-center">
                <NewTransactionButton />
                <NewRicorrenzaButton />
                <NewCategoryButton />
            </div>

            {/* ====================== */}
            {/* GRIGLIA CARD RIASSUNTIVE */}
            {/* ====================== */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
                <TransazioniCard />
                <RicorrentiCard />
                <CategorieCard />
                <ProssimoPagamentoCard />
            </div>
        </div>
    );
}
