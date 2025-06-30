"use client";

// =========================================================
// RicorrentiPage.tsx
// Root della dashboard Ricorrenze Ricorrenti
// =========================================================

// -------------------
// IMPORTS
// -------------------
import { useState } from "react";

// --- Componenti principali ---
import CardTotaliAnnui from "./Card/CardTotaliAnnui";
import CardAggiungiRicorrenza from "./Card/CardAggiungiRicorrenza";
import CardGraficoPagamenti from "./Card/CardGraficoPagamenti";
import ListaRicorrenzePerPrezzo from "./liste/ListaRicorrenzePerPrezzo";
import ListaProssimiPagamenti from "./liste/ListaProssimiPagamenti";
import AreaGraficiRicorrenze from "./grafici/AreaGraficiRicorrenze";

// --- Funzioni & costanti di utilità ---
import {
    ordinaPerPrezzo,
    calcolaTotaliAnnuiPerFrequenza,
    filtraPagamentiEntro,
    totalePagamenti,
    daysArr,
    barChartData,
    barChartOptions,
} from "./utils/ricorrenza-utils";

// --- File mock ---
import { mockRicorrenze } from "./mockRicorrenze";

// =========================================================
// COMPONENTE PRINCIPALE
// =========================================================

export default function RicorrentiPage() {
    // ------------------------------------
    // STATE: filtro scadenze
    // ------------------------------------
    const [filtroScadenze, setFiltroScadenze] = useState<"tutti" | "settimana" | "mese">("tutti");

    // ------------------------------------
    // LOGICA: preparazione dati dashboard
    // ------------------------------------
    const ricorrenzePerPrezzo = ordinaPerPrezzo(mockRicorrenze);
    const totaliAnnui = calcolaTotaliAnnuiPerFrequenza(mockRicorrenze);
    const totaleAnnuale = Object.values(totaliAnnui).reduce((sum, val) => sum + val, 0);

    // Lista pagamenti filtrata per tab (tutti/settimana/mese)
    let pagamentiDaMostrare = [...mockRicorrenze];
    if (filtroScadenze === "settimana") pagamentiDaMostrare = filtraPagamentiEntro(mockRicorrenze, 7);
    if (filtroScadenze === "mese") pagamentiDaMostrare = filtraPagamentiEntro(mockRicorrenze, 31);

    // Totali per badge rapidi
    const totaleSettimana = totalePagamenti(filtraPagamentiEntro(mockRicorrenze, 7));
    const totaleMese = totalePagamenti(filtraPagamentiEntro(mockRicorrenze, 31));

    // =========================================================
    // RENDER: layout principale dashboard ricorrenze
    // =========================================================
    return (
        <div className="space-y-8">
            {/* ===================================================== */}
            {/* === 1. CARDS TOP (Totali, Aggiungi, Grafico)       === */}
            {/* ===================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardTotaliAnnui totaliAnnui={totaliAnnui} totaleAnnuale={totaleAnnuale} />
                <CardAggiungiRicorrenza />
                <CardGraficoPagamenti barChartData={barChartData} barChartOptions={barChartOptions} daysArr={daysArr} />
            </div>
            {/* ===================================================== */}
            {/* === 2. LISTE PRINCIPALI (Ricorrenze, Pagamenti)    === */}
            {/* ===================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListaRicorrenzePerPrezzo ricorrenze={ricorrenzePerPrezzo} />
                <ListaProssimiPagamenti
                    pagamenti={pagamentiDaMostrare}
                    filtro={filtroScadenze}
                    setFiltro={setFiltroScadenze}
                    totaleSettimana={totaleSettimana}
                    totaleMese={totaleMese}
                />
            </div>
            {/* ===================================================== */}
            {/* === 3. AREA GRAFICI AVANZATI (placeholder)         === */}
            {/* ===================================================== */}
            <AreaGraficiRicorrenze />
        </div>
    );
}
