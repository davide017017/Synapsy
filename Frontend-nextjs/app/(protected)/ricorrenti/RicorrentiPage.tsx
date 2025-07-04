"use client";

// =======================================================
// RicorrentiPage.tsx
// Dashboard Ricorrenze — usa context globale Ricorrenze
// =======================================================

import { useState } from "react";
import { useRicorrenze } from "@/context/contexts/RicorrenzeContext";
import { Ricorrenza } from "@/types/types/ricorrenza";

import CardTotaliAnnui from "./card/CardTotaliAnnui";
import CardGraficoPagamenti from "./card/CardGraficoPagamenti";
import ListaRicorrenzePerFrequenza from "./liste/ListaRicorrenzePerFrequenza";
import ListaProssimiPagamenti from "./liste/ListaProssimiPagamenti";
import AreaGraficiRicorrenze from "./grafici/AreaGraficiRicorrenze";
import NewRicorrenzaButton from "@/app/(protected)/newRicorrenza/NewRicorrenzaButton";

import {
    ordinaPerPrezzo,
    calcolaTotaliAnnuiPerFrequenza,
    filtraPagamentiEntro,
    totalePagamenti,
    daysArr,
    buildBarChartData,
    buildBarChartOptions,
} from "./utils/ricorrenza-utils";
import { deleteRicorrenza, updateRicorrenza } from "@/lib/api/ricorrenzeApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function RicorrentiPage() {
    // --------- STATE per tabs (solo filtri UI) ---------
    const [filtroScadenze, setFiltroScadenze] = useState<"tutti" | "settimana" | "mese">("tutti");

    // --------- DATI DAL CONTEXT GLOBALE ---------
    const { ricorrenze, loading, refresh, openModal } = useRicorrenze();
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // --------- PREPARAZIONE DATI PER LE CARDS ---------
    const ricorrenzePerFrequenza = ordinaPerPrezzo(ricorrenze);
    const totaliAnnui = calcolaTotaliAnnuiPerFrequenza(ricorrenze);
    const totaleAnnuale = Object.values(totaliAnnui).reduce((sum, val) => sum + val, 0);

    // --------- FILTRI SCADENZE ---------
    let pagamentiDaMostrare = [...ricorrenze];
    if (filtroScadenze === "settimana") pagamentiDaMostrare = filtraPagamentiEntro(ricorrenze, 7);
    if (filtroScadenze === "mese") pagamentiDaMostrare = filtraPagamentiEntro(ricorrenze, 31);

    const totaleSettimana = totalePagamenti(filtraPagamentiEntro(ricorrenze, 7));
    const totaleMese = totalePagamenti(filtraPagamentiEntro(ricorrenze, 31));

    // --------- DATI PER IL GRAFICO ---------
    const chartData = buildBarChartData(ricorrenze);
    const chartOptions = buildBarChartOptions();

    // =======================================================
    // CALLBACK AZIONI — collegano API, context e refresh
    // =======================================================

    // ---- Elimina ricorrenza ----
    const handleDelete = async (ricorrenza: Ricorrenza) => {
        if (!token) {
            toast.error("Utente non autenticato");
            return;
        }
        try {
            await deleteRicorrenza(token, ricorrenza);
            toast.success("Ricorrenza eliminata");
            refresh(); // ricarica dal context
        } catch (e) {
            toast.error("Errore durante l'eliminazione");
        }
    };

    // ---- Modifica ricorrenza ----
    const handleEdit = (ricorrenza: Ricorrenza) => {
        openModal(ricorrenza, () => {
            refresh();
        });
    };

    // =======================================================
    // RENDER
    // =======================================================
    return (
        <div className="space-y-8">
            {/* === 1. CARDS TOP (Totali, Aggiungi, Grafico) === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardTotaliAnnui ricorrenze={ricorrenze} />
                <NewRicorrenzaButton label="Aggiungi ricorrenza" />
                <CardGraficoPagamenti barChartData={chartData} barChartOptions={chartOptions} daysArr={daysArr} />
            </div>

            {/* === 2. LISTE PRINCIPALI (Ricorrenze, Pagamenti) === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListaRicorrenzePerFrequenza
                    ricorrenze={ricorrenzePerFrequenza}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <ListaProssimiPagamenti
                    pagamenti={pagamentiDaMostrare}
                    filtro={filtroScadenze}
                    setFiltro={setFiltroScadenze}
                    totaleSettimana={totaleSettimana}
                    totaleMese={totaleMese}
                />
            </div>

            {/* === 3. AREA GRAFICI AVANZATI (Placeholder) === */}
            <AreaGraficiRicorrenze />

            {/* === LOADING & ERROR === */}
            {loading && <div className="text-center text-zinc-400 py-6">Caricamento ricorrenze...</div>}
        </div>
    );
}

// =======================================================
// END RicorrentiPage.tsx
// =======================================================
