"use client";

// =======================================================
// RicorrentiPage.tsx
// Dashboard Ricorrenze — usa context globale Ricorrenze
// =======================================================

import { useState } from "react";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { Ricorrenza } from "@/types/models/ricorrenza";
import CardTotaliAnnui from "./card/CardTotaliAnnui";
import CardGraficoPagamenti from "./card/CardGraficoPagamenti";
import ListaRicorrenzePerFrequenza from "./liste/ListaRicorrenzePerFrequenza";
import ListaProssimiPagamenti from "./liste/ListaProssimiPagamenti";
import AreaGraficiRicorrenze from "./grafici/AreaGraficiRicorrenze";
import RicorrentiPageSkeleton from "./skeleton/RicorrentiPageSkeleton";
import {
    ordinaPerPrezzo,
    calcolaTotaliAnnuiPerFrequenza,
    filtraPagamentiEntro,
    totalePagamenti,
    daysArr,
    buildBarChartOptions,
} from "./utils/ricorrenza-utils";
import { deleteRicorrenza } from "@/lib/api/ricorrenzeApi";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // ----- Dati per cards -----
    const ricorrenzePerFrequenza = ordinaPerPrezzo(ricorrenze);
    const totaliAnnui = calcolaTotaliAnnuiPerFrequenza(ricorrenze);

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
        <div className="space-y-8">
            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-4 md:p-6 shadow-md overflow-hidden animate-fade-in">
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Repeat
                        className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] text-[hsl(var(--c-secondary))] opacity-5"
                        style={{ filter: "blur(2px)" }}
                    />
                </div>

                <div className="relative z-10 space-y-2">
                    {/* ───────── Header row (mobile compatto) ───────── */}
                    <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-2">
                        <h1 className="text-lg md:text-3xl font-serif font-bold flex items-center gap-2 text-[hsl(var(--c-primary-dark))]">
                            <Repeat className="w-5 h-5 md:w-7 md:h-7 text-[hsl(var(--c-primary))]" />
                            <span>Ricorrenze</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewRicorrenzaButton />
                        </div>
                    </div>

                    {/* ───────── Subtitle ───────── */}
                    <p className="text-xs md:text-sm text-[hsl(var(--c-text-secondary))] text-left md:text-center">
                        Tieni sotto controllo abbonamenti e pagamenti ricorrenti nel tempo.
                    </p>
                </div>
            </div>

            {/* === Cards principali === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardTotaliAnnui ricorrenze={ricorrenze} />
                <CardGraficoPagamenti ricorrenze={ricorrenze} />
            </div>
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

            {/* === Area grafici avanzati (opzionale) === */}
            <AreaGraficiRicorrenze />
        </div>
    );
}
// =======================================================
// END RicorrentiPage.tsx
// =======================================================
