// ============================
// ricorrenza-utils.ts
// Utility principali per ricorrenze (ordinamento, calcoli, chart, aggregazioni)
// ============================

import { Ricorrenza } from "@/types/models/ricorrenza";
import type { Occorrenza } from "@/types/ricorrenti/liste";
import { eur } from "@/utils/formatCurrency";

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
    halfannually: "Semestrale",
    annually: "Annuale",
};

// ╔══════════════════════════════════════════════════════╗
// ║ NORMALIZZAZIONE FREQUENZE (ENG/ITA → standard ENG)  ║
// ╚══════════════════════════════════════════════════════╝

export function normalizzaFrequenza(freq: string): "daily" | "weekly" | "monthly" | "annually" {
    const map: Record<string, "daily" | "weekly" | "monthly" | "annually"> = {
        Giornaliero: "daily",
        giornaliero: "daily",
        daily: "daily",
        DAILY: "daily",
        Settimanale: "weekly",
        settimanale: "weekly",
        weekly: "weekly",
        Weekly: "weekly",
        Mensile: "monthly",
        mensile: "monthly",
        monthly: "monthly",
        Monthly: "monthly",
        annually: "annually",
        Annually: "annually",
        Annuale: "annually",
        annuale: "annually",
        yearly: "annually",
        Yearly: "annually",
        annual: "annually",
        Annual: "annually",
    };
    return map[freq] ?? "monthly";
}

// ╔══════════════════════════════════════════════════════╗
// ║ 2. ORDINAMENTI E CALCOLI DI BASE                    ║
// ╚══════════════════════════════════════════════════════╝

export function ordinaPerPrezzo(arr: Ricorrenza[]): Ricorrenza[] {
    return [...arr].sort((a, b) => b.importo - a.importo);
}

export function ordinaPerFrequenza(arr: Ricorrenza[]): Ricorrenza[] {
    return [...arr].sort(
        (a, b) =>
            (frequenzaOrder[a.frequenza as keyof typeof frequenzaOrder] ?? 99) -
            (frequenzaOrder[b.frequenza as keyof typeof frequenzaOrder] ?? 99)
    );
}

export function filtraPagamentiEntro(arr: Ricorrenza[], giorni: number = 7): Ricorrenza[] {
    const oggi = new Date();
    const finePeriodo = new Date(oggi);
    finePeriodo.setDate(oggi.getDate() + giorni);
    return arr.filter((r) => new Date(r.prossima) >= oggi && new Date(r.prossima) <= finePeriodo);
}

export function totalePagamenti(arr: Ricorrenza[]): number {
    return arr.reduce((sum, r) => sum + r.importo, 0);
}

// ╔══════════════════════════════════════════════════════╗
// ║ 3. GESTIONE GIORNI & SUPPORTO CHART.JS              ║
// ╚══════════════════════════════════════════════════════╝

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

export function dateKey(date: Date): string {
    if (!date || isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

export const daysToShow = 7;
export const daysArr = getDaysRangeArray(daysToShow);

// ╔══════════════════════════════════════════════════════╗
// ║ 3B. CHART.JS: OPZIONI BAR CON LINEA E LABEL "0"     ║
// ╚══════════════════════════════════════════════════════╝

export function buildBarChartOptions(saldoPerGiorno: number[] = []) {
    // Calcola min/max per visualizzare bene lo zero (baseline)
    const minY = saldoPerGiorno.length && Math.min(...saldoPerGiorno) < 0 ? Math.min(...saldoPerGiorno, 0) : 0;
    const maxY = saldoPerGiorno.length ? Math.max(...saldoPerGiorno, 0) : 100;

    return {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (ctx: any) {
                        const idx = ctx.dataIndex;
                        return `Saldo: ${eur(ctx.dataset.data[idx])}`;
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12 },
                    color: "#B5BAC7", // Grigio chiaro
                },
            },
            y: {
                grid: {
                    // Linea zero nera, le altre grigio molto chiaro
                    color: (ctx: { tick: { value: number } }) => (ctx.tick.value === 0 ? "#2e2e2e" : "#23252a"), // zero nera, altre grigio antracite
                    lineWidth: (ctx: { tick: { value: number } }) => (ctx.tick.value === 0 ? 2.2 : 1),
                },
                beginAtZero: true,
                min: minY,
                max: maxY,
                ticks: {
                    color: "#B5BAC7", // Grigio chiaro (come sotto il grafico)
                    font: {
                        size: 13,
                        weight: (ctx: any) => (ctx?.tick?.value === 0 ? "bold" : "normal"),
                    },
                    // Mostra solo "0" in grassetto
                    callback: function (value: string | number) {
                        if (Number(value) === 0) return "0";
                        return value;
                    },
                },
            },
        },
    };
}

// ╔══════════════════════════════════════════════════════╗
// ║ 4. AGGREGAZIONI PER CARD ANNUA: SPESE/ENTRATE       ║
// ╚══════════════════════════════════════════════════════╝

export function aggregaRicorrenzePerTipoEFrequenza(ricorrenze: Ricorrenza[]) {
    const result: Record<"spesa" | "entrata", Record<string, { totale: number; totaleAnnuale: number }>> = {
        spesa: {},
        entrata: {},
    };
    ricorrenze.forEach((r) => {
        const tipo = r.type === "entrata" ? "entrata" : "spesa";
        let freq = r.frequenza;
        if (freqMapEngToIta[freq]) freq = freqMapEngToIta[freq];
        const mult = frequencyAnnualMultiplier[freq as keyof typeof frequencyAnnualMultiplier] ?? 1;
        if (!result[tipo][freq]) result[tipo][freq] = { totale: 0, totaleAnnuale: 0 };
        result[tipo][freq].totale += r.importo ?? 0;
        result[tipo][freq].totaleAnnuale += (r.importo ?? 0) * mult;
    });
    return result;
}

export function sommaTotaleAnnua(aggregato: Record<string, { totaleAnnuale: number }>) {
    return Object.values(aggregato).reduce((sum, v) => sum + v.totaleAnnuale, 0);
}

// ╔══════════════════════════════════════════════════════╗
// ║ 5. UTILITY FREQUENZA (label IT, pill, giorni)       ║
// ╚══════════════════════════════════════════════════════╝

export const freqToIt: Record<"daily" | "weekly" | "monthly" | "annually", string> = {
    daily: "Giornaliera",
    weekly: "Settimanale",
    monthly: "Mensile",
    annually: "Annuale",
};

export const freqPillUtility: Record<string, string> = {
    Giornaliera:
        "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/60 dark:text-green-100 dark:border-green-700",
    Settimanale:
        "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/60 dark:text-blue-100 dark:border-blue-700",
    Mensile:
        "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-700",
    Annuale:
        "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/60 dark:text-orange-100 dark:border-orange-700",
};

export const freqToDays: Record<"daily" | "weekly" | "monthly" | "annually", number> = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    annually: 365,
};

// ======== Pill frequenza (palette CSS/HSL coerente tema) ========
export function getFreqPill(frequenza: string) {
    const freqNorm = normalizzaFrequenza(frequenza);

    // Palette CSS var
    const freqVars: Record<string, { bg: string; text: string; border: string }> = {
        daily: { bg: "var(--c-freq-daily-bg)", text: "var(--c-freq-daily-text)", border: "var(--c-freq-daily-border)" },
        weekly: {
            bg: "var(--c-freq-weekly-bg)",
            text: "var(--c-freq-weekly-text)",
            border: "var(--c-freq-weekly-border)",
        },
        monthly: {
            bg: "var(--c-freq-monthly-bg)",
            text: "var(--c-freq-monthly-text)",
            border: "var(--c-freq-monthly-border)",
        },
        annually: {
            bg: "var(--c-freq-annually-bg)",
            text: "var(--c-freq-annually-text)",
            border: "var(--c-freq-annually-border)",
        },
        biennial: {
            bg: "var(--c-freq-biennial-bg)",
            text: "var(--c-freq-biennial-text)",
            border: "var(--c-freq-biennial-border)",
        },
        custom: {
            bg: "var(--c-freq-custom-bg)",
            text: "var(--c-freq-custom-text)",
            border: "var(--c-freq-custom-border)",
        },
    };

    const { bg, text, border } = freqVars[freqNorm] ?? freqVars.custom;
    const label = freqToIt[freqNorm] ?? frequenza;

    const style = {
        backgroundColor: `hsl(${bg})`,
        color: `hsl(${text})`,
        borderColor: `hsl(${border})`,
        borderWidth: 1,
        fontWeight: 600,
    };

    return { label, style };
}

// ╔══════════════════════════════════════════════════════╗
// ║ 6. AGGREGAZIONE CONTEGGIO + TOTALE PER FREQUENZA    ║
// ╚══════════════════════════════════════════════════════╝

export function aggregaPerFrequenza(ricorrenze: Ricorrenza[]): Record<string, { count: number; totale: number }> {
    const result: Record<string, { count: number; totale: number }> = {};
    ricorrenze.forEach((r) => {
        if (!r.frequenza || typeof r.importo !== "number" || Number.isNaN(r.importo)) return;
        const bucket = result[r.frequenza] ?? (result[r.frequenza] = { count: 0, totale: 0 });
        bucket.count += 1;
        bucket.totale += r.importo;
    });
    return result;
}

// ╔══════════════════════════════════════════════════════╗
// ║ 7. RIEPILOGO MENSILE / ANNUO (barra + footer)       ║
// ╚══════════════════════════════════════════════════════╝

export function riepilogoTotali(ricorrenze: Ricorrenza[]) {
    const aggregato = aggregaRicorrenzePerTipoEFrequenza(ricorrenze);
    const speseAnnue = sommaTotaleAnnua(aggregato.spesa);
    const entrateAnnue = sommaTotaleAnnua(aggregato.entrata);
    const bilancioAnnuo = entrateAnnue - speseAnnue;
    return {
        aggregato,
        speseAnnue,
        entrateAnnue,
        speseMensili: speseAnnue / 12,
        entrateMensili: entrateAnnue / 12,
        bilancioAnnuo,
        bilancioMensile: bilancioAnnuo / 12,
    };
}

// ╔══════════════════════════════════════════════════════╗
// ║ 8. OCCORRENZE FUTURE (finestre 7 / 7-30 giorni)     ║
// ╚══════════════════════════════════════════════════════╝

export function espandiOccorrenze(r: Ricorrenza, from: Date, to: Date): Occorrenza[] {
    const step = freqToDays[normalizzaFrequenza(r.frequenza)] ?? 30;
    const occs: Occorrenza[] = [];
    const current = new Date(r.prossima);
    if (current < from) {
        const diffDays = Math.ceil((from.getTime() - current.getTime()) / (1000 * 3600 * 24));
        current.setDate(current.getDate() + Math.ceil(diffDays / step) * step);
    }
    while (current <= to) {
        occs.push({ ricorrenza: r, data: current.toISOString().slice(0, 10) });
        current.setDate(current.getDate() + step);
    }
    return occs;
}

export function bilancioOccorrenze(arr: Occorrenza[]): number {
    return arr.reduce((sum, o) => sum + (o.ricorrenza.type === "entrata" ? 1 : -1) * (o.ricorrenza.importo ?? 0), 0);
}

// Stesse finestre usate da gruppi lista e footer → subtotali sempre coerenti
export function occorrenzePerFinestra(ricorrenze: Ricorrenza[]) {
    const DAY = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekTo = new Date(today.getTime() + 6 * DAY);
    const monthFrom = new Date(weekTo.getTime() + DAY);
    const monthTo = new Date(today.getTime() + 29 * DAY);

    const occorrenze7 = ricorrenze.flatMap((r) => espandiOccorrenze(r, today, weekTo));
    const occorrenze30 = ricorrenze.flatMap((r) => espandiOccorrenze(r, monthFrom, monthTo));
    occorrenze7.sort((a, b) => a.data.localeCompare(b.data));
    occorrenze30.sort((a, b) => a.data.localeCompare(b.data));

    return {
        occorrenze7,
        occorrenze30,
        bilancio7: bilancioOccorrenze(occorrenze7),
        bilancio30: bilancioOccorrenze(occorrenze30),
    };
}

// ============================
// END ricorrenza-utils.ts
// ============================

