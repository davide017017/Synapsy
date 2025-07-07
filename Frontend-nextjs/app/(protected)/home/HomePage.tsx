"use client";

import TransazioniCard from "./cards/TransazioniCard";
import RicorrentiCard from "./cards/RicorrentiCard";
import CategorieCard from "./cards/CategorieCard";
import ProssimoPagamentoCard from "./cards/ProssimoPagamentoCard";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";
import NewCategoryButton from "../newCategory/NewCategoryButton";

export default function HomePage() {
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-2">
                        <span className="inline-block text-primary">🏠</span>
                        Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Benvenuto su Synapsi! Qui trovi una panoramica rapida delle tue finanze.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                    <NewTransactionButton />
                    <NewRicorrenzaButton />
                    <NewCategoryButton />
                </div>
            </div>

            {/* GRIGLIA CARD */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <TransazioniCard />
                <RicorrentiCard />
                <CategorieCard />
                <ProssimoPagamentoCard />
                {/* Altre card future */}
            </div>
        </div>
    );
}
