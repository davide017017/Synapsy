// utils/ricorrenzeCalendarUtils.ts

// ╔════════════════════════════════════════════════════════════════╗
// ║   buildRicorrenzeMap — Occorrenze ricorrenze in un range date  ║
// ╚════════════════════════════════════════════════════════════════╝

import type { Ricorrenza } from "@/types/models/ricorrenza";

// ────────────────────────────────────────────────────────────────
// Helpers privati
// ────────────────────────────────────────────────────────────────
function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function dateToKey(d: Date): string {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addMonths(date: Date, n: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + n, date.getDate());
}

function addYears(date: Date, n: number): Date {
    return new Date(date.getFullYear() + n, date.getMonth(), date.getDate());
}

function addDays(date: Date, n: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

function parseDateKey(value: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function advanceByFrequenza(date: Date, frequenza: string, interval: number): Date {
    switch (frequenza) {
        case "giornaliero":
        case "daily":
            return addDays(date, interval);
        case "settimanale":
        case "weekly":
            return addDays(date, interval * 7);
        case "mensile":
        case "monthly":
            return addMonths(date, interval);
        case "annuale":
        case "yearly":
        case "annual":
            return addYears(date, interval);
        default:
            // Frequenza sconosciuta: nessun avanzamento sicuro, evita loop infinito
            return addDays(date, interval > 0 ? interval : 1);
    }
}

// ────────────────────────────────────────────────────────────────
// buildRicorrenzeMap
// ────────────────────────────────────────────────────────────────
const MAX_ITERATIONS = 366;

export function buildRicorrenzeMap(
    ricorrenze: Ricorrenza[],
    fromDate: Date,
    toDate: Date
): Map<string, Ricorrenza[]> {
    const map = new Map<string, Ricorrenza[]>();

    const fromKey = dateToKey(fromDate);
    const toKey = dateToKey(toDate);

    for (const r of ricorrenze) {
        if (r.is_active !== true) continue;

        const start = parseDateKey(r.prossima);
        if (!start) continue;

        const interval = r.interval && r.interval > 0 ? r.interval : 1;

        let current = start;
        let iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            const key = dateToKey(current);
            if (key > toKey) break;

            if (key >= fromKey) {
                const arr = map.get(key);
                if (arr) arr.push(r);
                else map.set(key, [r]);
            }

            current = advanceByFrequenza(current, r.frequenza, interval);
            iterations++;
        }
    }

    return map;
}
