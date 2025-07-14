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
    // ----- UI State -----
    const [filtroScadenze, setFiltroScadenze] = useState<"tutti" | "settimana" | "mese">("tutti");

    // ----- Dati dal context -----
    const { ricorrenze, loading, refresh, openModal } = useRicorrenze();
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

    // ----- Dati grafico -----
    const chartData = buildBarChartData(ricorrenze);
    const chartOptions = buildBarChartOptions();

    // =======================================================
    // CALLBACK AZIONI
    // =======================================================
    const handleDelete = async (ricorrenza: Ricorrenza) => {
        if (!token) return toast.error("Utente non autenticato");
        try {
            await deleteRicorrenza(token, ricorrenza);
            toast.success("Ricorrenza eliminata");
            refresh();
        } catch {
            toast.error("Errore durante l'eliminazione");
        }
    };

    const handleEdit = (ricorrenza: Ricorrenza) => {
        openModal(ricorrenza, refresh);
    };

    // =======================================================
    // RENDER
    // =======================================================
    return (
        <div className="space-y-8">
            {/* === Azioni rapide === */}
            <div className="flex justify-end">
                <NewRicorrenzaButton />
            </div>

            {/* === Cards principali === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardTotaliAnnui ricorrenze={ricorrenze} />
                <CardGraficoPagamenti barChartData={chartData} barChartOptions={chartOptions} daysArr={daysArr} />
            </div>
            {/* --------------------------------------------------- */}

            {/* === Liste principali === */}
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
            {/* --------------------------------------------------- */}

            {/* === Area grafici avanzati (se vuoi lasciarla) === */}
            <AreaGraficiRicorrenze />

            {/* === Loading/errore === */}
            {loading && <div className="text-center text-zinc-400 py-6">Caricamento ricorrenze...</div>}
        </div>
    );
}
// =======================================================
// END RicorrentiPage.tsx
// =======================================================
