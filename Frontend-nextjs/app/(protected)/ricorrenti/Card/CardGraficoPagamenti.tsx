"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ CardGraficoPagamenti.tsx — Prossimi pagamenti ricorrenti   ║
// ╚══════════════════════════════════════════════════════════════╝

import { BarChart as BarChartIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Ricorrenza } from "@/types/models/ricorrenza";
import type { CardGraficoPagamentiProps } from "@/types/ricorrenti/card";
import { buildBarChartOptions, daysArr } from "../utils/ricorrenza-utils";

// --------- Registrazione elementi Chart.js ---------
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ============================
// Props tipizzate
// ============================

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

// ╔══════════════════════════════════════════════════════╗
// ║ COMPONENTE PRINCIPALE                               ║
// ╚══════════════════════════════════════════════════════╝

export default function CardGraficoPagamenti({ ricorrenze, customDaysArr }: CardGraficoPagamentiProps) {
    // ===== Variabili CSS per colori =====
    function cssVar(name: string) {
        return getComputedStyle(document.documentElement).getPropertyValue(name)?.trim();
    }

    // ===== Giorni da mostrare =====
    const giorni = customDaysArr ?? daysArr;

    // ===== Calcola saldo giornaliero e colori colonnine =====
    const saldoPerGiorno = giorni.map((d) => {
        const key = d.toISOString().slice(0, 10);
        return ricorrenze
            .filter((r) => r.prossima && new Date(r.prossima).toISOString().slice(0, 10) === key)
            .reduce((sum, r) => sum + (r.type === "spesa" ? -r.importo : r.importo), 0);
    });

    const barColors = saldoPerGiorno.map((val) =>
        val > 0
            ? `hsl(${cssVar("--c-total-positive-border") || "148 22% 22%"} / 0.95)`
            : val < 0
            ? `hsl(${cssVar("--c-total-negative-border") || "358 19% 22%"} / 0.95)`
            : `hsl(${cssVar("--c-total-zero-border") || "220 9% 27%"} / 0.95)`
    );

    const labels = giorni.map((d) => d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }));

    const chartData = {
        labels,
        datasets: [
            {
                label: "Saldo",
                data: saldoPerGiorno,
                backgroundColor: barColors,
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = buildBarChartOptions(saldoPerGiorno);
    const hasData = saldoPerGiorno.some((v) => Math.abs(v) > 0);

    // ===== Render =====
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
                    {giorni.length > 0
                        ? `Periodo: ${getDateRangeStr(giorni)}`
                        : "Nessun pagamento previsto in questo intervallo"}
                </div>
            </div>
            {/* ---------- Grafico Chart.js o fallback ---------- */}
            <div className="w-full px-2 pb-5 h-36 flex items-center justify-center">
                {hasData ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <div className="text-sm text-[hsl(var(--c-text-tertiary))] font-medium p-4">
                        Nessun pagamento previsto nei prossimi giorni.
                    </div>
                )}
            </div>
        </div>
    );
}

// ╔══════════════════════════════════════════════════════╗
// ║ END CardGraficoPagamenti.tsx                        ║
// ╚══════════════════════════════════════════════════════╝
