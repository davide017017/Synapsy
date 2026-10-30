"use client";

import HeroCarousel from "./hero/HeroCarousel";
import TransazioniCard from "./cards/TransazioniCard";
import RicorrentiCard from "./cards/RicorrentiCard";
import CategorieCard from "./cards/CategorieCard";
import ProssimiPagamentiCard from "./cards/ProssimiPagamentiCard";
import PanoramicaCard from "./cards/PanoramicaCard";
import ProssimiCard from "./cards/ProssimiCard";
import CategorieCompactCard from "./cards/CategorieCompactCard";
import ChartsCarousel from "./cards/ChartsCarousel";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";
import NewCategoryButton from "../newCategory/NewCategoryButton";
import { useUpcomingPayments } from "./hooks/useUpcomingPayments";

// ─────────────────────────────────────────
// HomePage: mobile compatta (< lg), desktop a griglia (lg+)
// ─────────────────────────────────────────
export default function HomePage() {
    // Prossimi pagamenti condivisi da calendario (pallini rossi) e card Prossimi
    const upcoming = useUpcomingPayments(30, 20);

    return (
        // Mobile: annulla il p-4 di <main> e usa padding 10px; il pb-36 di <main>
        // resta e lascia spazio a bottom nav + FAB.
        <div className="-mx-4 -mt-4 p-[10px] flex flex-col gap-2 lg:mx-0 lg:mt-0 lg:p-0 lg:px-6">
            {/* Hero / carosello (mobile sotto i bottoni, desktop in cima) */}
            <div className="order-2 lg:order-1">
                <HeroCarousel />
            </div>

            {/* Bottoni azione — mobile: una riga, flex-1 */}
            <div className="order-1 flex gap-2 lg:hidden">
                <NewTransactionButton compact />
                <NewRicorrenzaButton compact />
                <NewCategoryButton compact />
            </div>

            {/* Bottoni azione — desktop */}
            <div className="hidden lg:flex order-2 gap-2 justify-center">
                <NewTransactionButton />
                <NewRicorrenzaButton />
                <NewCategoryButton />
            </div>

            {/* Mobile/tablet layout (below lg): card a piena larghezza */}
            <div className="order-3 flex flex-col gap-2 w-full lg:hidden">
                <PanoramicaCard upcoming={upcoming.entries} />
                <ProssimiCard {...upcoming} />
                <CategorieCompactCard />
                <ChartsCarousel compact />
            </div>

            {/* Desktop layout (lg+) */}
            <div className="hidden lg:grid order-3 grid-cols-4 gap-4 w-full">
                <TransazioniCard />
                <RicorrentiCard />
                <CategorieCard />
                <ProssimiPagamentiCard />
            </div>
            <div className="hidden lg:block order-4 w-full">
                <ChartsCarousel />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// File: HomePage.tsx
// Serve: dashboard principale.
// Come: mobile (< lg) → colonna compatta pensata per 375×667: bottoni,
//       carosello 104px, settimana + statistiche, Prossimi, Categorie,
//       grafico basso. Desktop (lg+) → carosello, bottoni, griglia a 4
//       colonne e grafico, come prima.
// ─────────────────────────────────────────────
