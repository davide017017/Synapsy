// ============================
// ricorrenza-utils.ts
// Utility e costanti per la sezione ricorrenze ricorrenti
// ============================

import { Ricorrenza } from "@/types";
import { mockRicorrenze } from "../mockRicorrenze";

// ============================
// 1. COSTANTI ORDINAMENTO & MOLTIPLICATORI
// ============================
export const frequenzaOrder = {
    Settimanale: 0,
    Mensile: 1,
    Bimestrale: 2,
    Trimestrale: 3,
    Semestrale: 4,
    Annuale: 5,
} as const;

export const frequencyAnnualMultiplier = {
    Settimanale: 52,
    Mensile: 12,
    Bimestrale: 6,
    Trimestrale: 4,
    Semestrale: 2,
    Annuale: 1,
} as const;

// ============================
// 2. FUNZIONI DI ORDINAMENTO E CALCOLO
// ============================

/**
 * Ordina le ricorrenze per importo decrescente.
 */
export function ordinaPerPrezzo(arr: Ricorrenza[]): Ricorrenza[] {
    return [...arr].sort((a, b) => b.importo - a.importo);
}

/**
 * Ordina le ricorrenze per frequenza (ordine logico: Settimanale, Mensile, ...)
 */
export function ordinaPerFrequenza(arr: Ricorrenza[]): Ricorrenza[] {
    return [...arr].sort(
        (a, b) =>
            (frequenzaOrder[a.frequenza as keyof typeof frequenzaOrder] ?? 99) -
            (frequenzaOrder[b.frequenza as keyof typeof frequenzaOrder] ?? 99)
    );
}

/**
 * Calcola il totale annuo stimato per ciascuna frequenza.
 */
export function calcolaTotaliAnnuiPerFrequenza(arr: Ricorrenza[]): Record<string, number> {
    const annuali: Record<string, number> = {};
    arr.forEach((r) => {
        const freq = r.frequenza;
        const mult = frequencyAnnualMultiplier[freq as keyof typeof frequencyAnnualMultiplier] ?? 1;
        annuali[freq] = (annuali[freq] ?? 0) + r.importo * mult;
    });
    return annuali;
}

/**
 * Filtra i pagamenti che scadono entro un certo numero di giorni.
 */
export function filtraPagamentiEntro(arr: Ricorrenza[], giorni: number = 7): Ricorrenza[] {
    const oggi = new Date();
    const finePeriodo = new Date(oggi);
    finePeriodo.setDate(oggi.getDate() + giorni);
    return arr.filter((r) => new Date(r.prossima) >= oggi && new Date(r.prossima) <= finePeriodo);
}

/**
 * Somma totale degli importi delle ricorrenze.
 */
export function totalePagamenti(arr: Ricorrenza[]): number {
    return arr.reduce((sum, r) => sum + r.importo, 0);
}

// ============================
// 3. GESTIONE GIORNI & GRAFICI (Chart.js)
// ============================

/**
 * Ritorna un array di oggetti Date a partire da oggi per N giorni.
 */
export function getDaysRangeArray(days: number): Date[] {
    const res: Date[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        res.push(d);
    }
    return res;
}

/**
 * Chiave data "YYYY-MM-DD" per confronto veloce.
 */
export function dateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
}

// --- Giorni da mostrare nel grafico ---
export const daysToShow = 7;
export const daysArr = getDaysRangeArray(daysToShow);

// --- Mappa: data => ricorrenze in quella data (per grafico) ---
export const ricorrenzePerData: Record<string, Ricorrenza[]> = Object.fromEntries(
    daysArr.map((day) => {
        const key = dateKey(day);
        const ric = mockRicorrenze.filter((r) => dateKey(new Date(r.prossima)) === key);
        return [key, ric];
    })
);

// --- Dati per grafico Chart.js ---
export const barChartData = {
    labels: daysArr.map((d) => d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" })),
    datasets: [
        {
            label: "Importo",
            data: daysArr.map((d) => {
                const key = dateKey(d);
                const tot = ricorrenzePerData[key]?.reduce((sum, r) => sum + r.importo, 0) || 0;
                return tot;
            }),
            backgroundColor: "rgba(60,179,113,0.75)",
            borderRadius: 8,
        },
    ],
};

/**
 * Opzioni per grafico Chart.js (tooltip, assi, ecc)
 */
export const barChartOptions = {
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: function (ctx: any) {
                    const idx = ctx.dataIndex;
                    const key = dateKey(daysArr[idx]);
                    const ric = ricorrenzePerData[key] || [];
                    if (ric.length === 0) return "Nessuna ricorrenza";
                    return ric.map((r) => `${r.nome}: €${r.importo.toFixed(2)}`);
                },
                title: function (items: any) {
                    const idx = items[0].dataIndex;
                    return daysArr[idx].toLocaleDateString("it-IT", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                    });
                },
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
        },
        y: { grid: { display: false } },
    },
};

// ============================
// END UTILS RICORRENZE
// ============================
