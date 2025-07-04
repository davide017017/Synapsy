// ============================
// ricorrenza-utils.ts
// Utility principali per ricorrenze (ordinamento, calcoli, chart, aggregazioni)
// ============================

import { Ricorrenza } from "@/types/types/ricorrenza";

// ╔══════════════════════════════════════════════════════╗
// ║ 1. COSTANTI: ORDINE FREQUENZA E MOLTIPLICATORI      ║
// ╚══════════════════════════════════════════════════════╝

export const frequenzaOrder = {
    Giornaliero: 0,
    Settimanale: 1,
    Mensile: 2,
    Bimestrale: 3,
    Trimestrale: 4,
    Semestrale: 5,
    Annuale: 6,
} as const;

export const frequencyAnnualMultiplier = {
    Giornaliero: 365,
    Settimanale: 52,
    Mensile: 12,
    Bimestrale: 6,
    Trimestrale: 4,
    Semestrale: 2,
    Annuale: 1,
} as const;

// --------- Mappa ENG → ITA ---------
export const freqMapEngToIta: Record<string, string> = {
    daily: "Giornaliero",
    weekly: "Settimanale",
    monthly: "Mensile",
    bimonthly: "Bimestrale",
    quarterly: "Trimestrale",
    halfyearly: "Semestrale",
    annually: "Annuale",
};

// ╔══════════════════════════════════════════════════════╗
// ║ 2. ORDINAMENTI E CALCOLI DI BASE                    ║
// ╚══════════════════════════════════════════════════════╝

/**
 * Ordina ricorrenze dal prezzo più alto al più basso.
 */
export function ordinaPerPrezzo(arr: Ricorrenza[]): Ricorrenza[] {
    return [...arr].sort((a, b) => b.importo - a.importo);
}

/**
 * Ordina ricorrenze secondo la frequenza (ordine logico).
 */
export function ordinaPerFrequenza(arr: Ricorrenza[]): Ricorrenza[] {
    return [...arr].sort(
        (a, b) =>
            (frequenzaOrder[a.frequenza as keyof typeof frequenzaOrder] ?? 99) -
            (frequenzaOrder[b.frequenza as keyof typeof frequenzaOrder] ?? 99)
    );
}

/**
 * Calcola il totale importo per ciascuna frequenza (SOMMA SEMPLICE, NON annuo!).
 */
export function calcolaTotaliAnnuiPerFrequenza(ricorrenze: Ricorrenza[]): Record<string, number> {
    const totali: Record<string, number> = {};
    ricorrenze.forEach((r) => {
        if (!r.frequenza || typeof r.importo !== "number" || isNaN(r.importo)) return;
        if (!totali[r.frequenza]) totali[r.frequenza] = 0;
        totali[r.frequenza] += r.importo;
    });
    return totali;
}

/**
 * Filtra ricorrenze con scadenza entro X giorni da oggi.
 */
export function filtraPagamentiEntro(arr: Ricorrenza[], giorni: number = 7): Ricorrenza[] {
    const oggi = new Date();
    const finePeriodo = new Date(oggi);
    finePeriodo.setDate(oggi.getDate() + giorni);
    return arr.filter((r) => new Date(r.prossima) >= oggi && new Date(r.prossima) <= finePeriodo);
}

/**
 * Calcola il totale importo di un array di ricorrenze.
 */
export function totalePagamenti(arr: Ricorrenza[]): number {
    return arr.reduce((sum, r) => sum + r.importo, 0);
}

// ╔══════════════════════════════════════════════════════╗
// ║ 3. GESTIONE GIORNI & SUPPORTO CHART.JS              ║
// ╚══════════════════════════════════════════════════════╝

/**
 * Restituisce un array di Date per i prossimi N giorni.
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
 * Ottieni chiave 'YYYY-MM-DD' per una data (utile per mapping/grafici).
 */
export function dateKey(date: Date): string {
    if (!date || isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

export const daysToShow = 7;
export const daysArr = getDaysRangeArray(daysToShow);

/**
 * Crea i dati per un grafico Chart.js (bar) sulle ricorrenze nei prossimi giorni.
 */
export function buildBarChartData(ricorrenze: Ricorrenza[]) {
    // Mappa data → ricorrenze in quella data
    const ricorrenzePerData: Record<string, Ricorrenza[]> = Object.fromEntries(
        daysArr.map((day) => {
            const key = dateKey(day);
            const ric = ricorrenze.filter((r) => dateKey(new Date(r.prossima)) === key);
            return [key, ric];
        })
    );

    return {
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
}

/**
 * Opzioni per Chart.js (tooltip, assi, responsive...)
 */
export function buildBarChartOptions() {
    return {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (ctx: any) {
                        const idx = ctx.dataIndex;
                        return `Totale: €${ctx.dataset.data[idx].toFixed(2)}`;
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
}

// ╔══════════════════════════════════════════════════════╗
// ║ 4. AGGREGAZIONI PER CARD ANNUA: SPESE/ENTRATE       ║
// ╚══════════════════════════════════════════════════════╝

/**
 * Raggruppa ricorrenze per tipo ("spesa"/"entrata") e frequenza,
 * calcolando totale e totale annuo per ogni gruppo.
 * Esempio risultato:
 * {
 *   spesa: { Mensile: { totale: 10, totaleAnnuale: 120 }, ... },
 *   entrata: { Mensile: { totale: 20, totaleAnnuale: 240 }, ... }
 * }
 */
export function aggregaRicorrenzePerTipoEFrequenza(ricorrenze: Ricorrenza[]) {
    const result: Record<"spesa" | "entrata", Record<string, { totale: number; totaleAnnuale: number }>> = {
        spesa: {},
        entrata: {},
    };

    ricorrenze.forEach((r) => {
        const tipo = r.type === "entrata" ? "entrata" : "spesa";

        // ------ Conversione ENG → ITA se serve ------
        let freq = r.frequenza;
        if (freqMapEngToIta[freq]) freq = freqMapEngToIta[freq];

        const mult = frequencyAnnualMultiplier[freq as keyof typeof frequencyAnnualMultiplier] ?? 1;
        if (!result[tipo][freq]) result[tipo][freq] = { totale: 0, totaleAnnuale: 0 };
        result[tipo][freq].totale += r.importo ?? 0;
        result[tipo][freq].totaleAnnuale += (r.importo ?? 0) * mult;
    });

    return result;
}

/**
 * Somma il totale annuo di tutti i gruppi (usa per spese/entrate)
 */
export function sommaTotaleAnnua(aggregato: Record<string, { totaleAnnuale: number }>) {
    return Object.values(aggregato).reduce((sum, v) => sum + v.totaleAnnuale, 0);
}

// ============================
// END ricorrenza-utils.ts
// ============================
