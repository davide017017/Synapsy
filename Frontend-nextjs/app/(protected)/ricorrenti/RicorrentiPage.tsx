"use client";

// =======================================================
// RicorrentiPage.tsx
// Dashboard Ricorrenze — usa context globale Ricorrenze
// =======================================================

import { useState } from "react";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { Ricorrenza } from "@/types/models/ricorrenza";
import CardTotaliAnnui from "./card/CardTotaliAnnui";
import ListaRicorrenzePerFrequenza from "./liste/ListaRicorrenzePerFrequenza";
import ListaProssimiPagamenti from "./liste/ListaProssimiPagamenti";
import RicorrentiPageSkeleton from "./skeleton/RicorrentiPageSkeleton";
import { ordinaPerPrezzo, filtraPagamentiEntro, totalePagamenti } from "./utils/ricorrenza-utils";
import { Repeat } from "lucide-react";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function RicorrentiPage() {
    // ----- UI State -----
    const [filtroScadenze, setFiltroScadenze] = useState<"tutti" | "settimana" | "mese">("tutti");

    // ----- Dati dal context -----
    const { ricorrenze, loading, refresh, openModal, remove } = useRicorrenze();

    // ----- Dati per cards -----
    const ricorrenzePerFrequenza = ordinaPerPrezzo(ricorrenze);

    // ----- Filtri scadenze -----
    let pagamentiDaMostrare = [...ricorrenze];
    if (filtroScadenze === "settimana") pagamentiDaMostrare = filtraPagamentiEntro(ricorrenze, 7);
    if (filtroScadenze === "mese") pagamentiDaMostrare = filtraPagamentiEntro(ricorrenze, 31);

    const totaleSettimana = totalePagamenti(filtraPagamentiEntro(ricorrenze, 7));
    const totaleMese = totalePagamenti(filtraPagamentiEntro(ricorrenze, 31));

    // =======================================================
    // CALLBACK AZIONI
    // =======================================================
    const handleEdit = (ricorrenza: Ricorrenza) => {
        openModal(ricorrenza, refresh);
    };

    // =======================================================
    // RENDER
    // =======================================================
    if (loading) return <RicorrentiPageSkeleton />;

    return (
        <div className="space-y-2">
            <div
                className="
                    relative
                    rounded-2xl
                    border border-primary/20
                    bg-black/55
                    backdrop-blur-xl
                    p-3 md:p-5
                    shadow-[0_18px_55px_rgba(0,0,0,0.28)]
                    overflow-hidden
                    animate-fade-in
                "
            >
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Repeat
                        className="
                w-[140px] h-[140px]
                md:w-[180px] md:h-[180px]
                text-[hsl(var(--c-secondary))]
                opacity-5
            "
                        style={{ filter: "blur(2px)" }}
                    />
                </div>

                <div className="relative z-10 space-y-2">
                    {/* ───────── Header row ───────── */}
                    <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-2">
                        <h1
                            className="
                    flex items-center gap-2
                    font-mono
                    text-lg md:text-2xl
                    font-extrabold
                    uppercase
                    tracking-[0.14em]
                    text-primary
                    drop-shadow-[0_0_14px_hsl(var(--c-primary)/0.35)]
                "
                        >
                            <Repeat className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                            <span>Ricorrenti</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewRicorrenzaButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* === Card riepilogo === */}
            <CardTotaliAnnui ricorrenze={ricorrenze} />
            {/* --------------------------------------------------- */}

            {/* === Liste principali === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListaRicorrenzePerFrequenza
                    ricorrenze={ricorrenzePerFrequenza}
                    onEdit={handleEdit}
                    onDelete={(ricorrenza) => remove(ricorrenza.id)}
                />
                <ListaProssimiPagamenti
                    pagamenti={pagamentiDaMostrare}
                    filtro={filtroScadenze}
                    setFiltro={setFiltroScadenze}
                    totaleSettimana={totaleSettimana}
                    totaleMese={totaleMese}
                />
            </div>
            {/* --------------------------------------------------- */}
        </div>
    );
}
// =======================================================
// END RicorrentiPage.tsx
// =======================================================
