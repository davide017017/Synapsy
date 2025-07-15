"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ CardGraficoPagamenti.tsx — Prossimi pagamenti ricorrenti   ║
// ╚══════════════════════════════════════════════════════════════╝

import { BarChart as BarChartIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// --------- Registrazione elementi Chart.js ---------
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ============================
// Props tipizzate
// ============================
type Props = {
    barChartData: any;
    barChartOptions: any;
    daysArr: Date[];
};

// ============================
// Utility: formato range date
// ============================
function getDateRangeStr(daysArr: Date[]) {
    if (!daysArr.length) return "";
    const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
    const first = daysArr[0];
    const last = daysArr[daysArr.length - 1];
    if (first.getTime() === last.getTime()) {
        return first.toLocaleDateString("it-IT", opts);
    }
    return `${first.toLocaleDateString("it-IT", opts)} - ${last.toLocaleDateString("it-IT", opts)}`;
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ COMPONENTE PRINCIPALE                                      ║
// ╚══════════════════════════════════════════════════════════════╝

export default function CardGraficoPagamenti({ barChartData, barChartOptions, daysArr }: Props) {
    // Verifica presenza dati
    const hasData = barChartData?.datasets?.some((ds: any) => ds.data?.some((v: number) => v && v > 0));

    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-0 flex flex-col justify-center items-center shadow-md min-h-[320px] w-full">
            {/* ---------- Titolo hero centrato ---------- */}
            <div className="relative flex flex-col items-center justify-center w-full py-2 mb-2">
                <BarChartIcon
                    className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-10 w-28 h-28 pointer-events-none"
                    style={{ filter: "blur(1px)", color: "hsl(var(--c-secondary))" }}
                    aria-hidden
                />
                <div className="relative z-10 flex items-center gap-3 justify-center">
                    <BarChartIcon className="w-9 h-9 text-primary drop-shadow" />
                    <span className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight text-center text-[hsl(var(--c-primary-dark))]">
                        Prossimi pagamenti (7gg)
                    </span>
                </div>
                {/* ---------- Sottotitolo: range giorni ---------- */}
                <div className="mt-1 text-xs text-[hsl(var(--c-text-secondary))] font-medium">
                    {daysArr.length > 0
                        ? `Periodo: ${getDateRangeStr(daysArr)}`
                        : "Nessun pagamento previsto in questo intervallo"}
                </div>
            </div>
            {/* ---------- Grafico Chart.js o fallback ---------- */}
            <div className="w-full px-2 pb-5 h-36 flex items-center justify-center">
                {hasData ? (
                    <Bar data={barChartData} options={barChartOptions} />
                ) : (
                    <div className="text-sm text-[hsl(var(--c-text-tertiary))] font-medium p-4">
                        Nessun pagamento previsto nei prossimi giorni.
                    </div>
                )}
            </div>
        </div>
    );
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ END CardGraficoPagamenti.tsx                               ║
// ╚══════════════════════════════════════════════════════════════╝
