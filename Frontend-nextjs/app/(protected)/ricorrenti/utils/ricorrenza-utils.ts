// ============================
// ricorrenza-utils.ts
// Utility principali per ricorrenze (ordinamento, calcoli, chart, aggregazioni)
// ============================

import { Ricorrenza } from "@/types/models/ricorrenza";

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

export function calcolaTotaliAnnuiPerFrequenza(ricorrenze: Ricorrenza[]): Record<string, number> {
    const totali: Record<string, number> = {};
    ricorrenze.forEach((r) => {
        if (!r.frequenza || typeof r.importo !== "number" || isNaN(r.importo)) return;
        if (!totali[r.frequenza]) totali[r.frequenza] = 0;
        totali[r.frequenza] += r.importo;
    });
    return totali;
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
                        return `Saldo: €${ctx.dataset.data[idx].toFixed(2)}`;
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

// ============================
// END ricorrenza-utils.ts
// ============================

