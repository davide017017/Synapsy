"use client";

// =======================================================
// RicorrentiPage.tsx
// Dashboard Ricorrenze — usa context globale Ricorrenze
// =======================================================

import { useState } from "react";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { Ricorrenza } from "@/types/models/ricorrenza";
import CardTotaliAnnui from "./Card/CardTotaliAnnui";
import CardGraficoPagamenti from "./Card/CardGraficoPagamenti";
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

