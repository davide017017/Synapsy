"use client";

// ============================
// CardGraficoPagamenti.tsx
// Card: mostra il grafico dei prossimi pagamenti ricorrenti (Chart.js)
// ============================

import { BarChart as BarChartIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// --------- Registrazione elementi Chart.js ---------
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// --------- Props tipizzate ---------
type Props = {
    barChartData: any; // Dati per il grafico
    barChartOptions: any; // Opzioni per il grafico
    daysArr: Date[]; // Array dei giorni visualizzati (per eventuali controlli)
};

// --------- Componente principale ---------
export default function CardGraficoPagamenti({ barChartData, barChartOptions, daysArr }: Props) {
    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex flex-col items-center justify-center shadow-md min-h-[180px] gap-2">
            {/* ---------- Titolo Card ---------- */}
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-base">
                <BarChartIcon className="w-5 h-5" />
                Prossimi pagamenti (7gg)
            </div>
            {/* ---------- Grafico Chart.js ---------- */}
            <div className="w-full h-32">
                <Bar data={barChartData} options={barChartOptions} />
            </div>
        </div>
    );
}

// ============================
// END CardGraficoPagamenti.tsx
// ============================
