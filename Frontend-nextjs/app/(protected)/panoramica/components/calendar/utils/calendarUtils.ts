// utils/calendarUtils.ts

// ╔════════════════════════════════════════════════════════════════╗
// ║   getCalendarGrid — Griglia calendario Google-style avanzata  ║
// ║   (6 settimane, inizia lunedì, opzionale numeri settimana)    ║
// ╚════════════════════════════════════════════════════════════════╝

import type { CalendarCell, CalendarWeek, CalendarOptions } from "@/types";

/**
 * Ritorna celle calendario (sempre 6x7) e, opzionalmente, settimane con numerazione ISO
 * @param year - Anno (es. 2024)
 * @param month - Mese (0=gennaio, 11=dicembre)
 * @param options - { withWeekNumbers: boolean }
 * @returns { cells, weeks? }
 */
export function getCalendarGrid(
    year: number,
    month: number,
    options: CalendarOptions = {}
): { cells: CalendarCell[]; weeks?: CalendarWeek[] } {
    // --- Giorni mese corrente e precedente ---
    const daysInCurrent = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    // --- Primo giorno settimana (0=lun, 6=dom) ---
    const firstDay = new Date(year, month, 1).getDay(); // 0=dom, 1=lun, ...
    const firstWeekDay = (firstDay + 6) % 7; // shift per partire da lunedì

    // --- Crea array celle 6x7 ---
    const cells: CalendarCell[] = [];

    // Giorni del mese precedente (riempimento)
    for (let i = 0; i < firstWeekDay; i++) {
        const day = daysInPrev - firstWeekDay + i + 1;
        cells.push({
            day,
            monthDelta: -1,
            date: new Date(year, month - 1, day),
        });
    }
    // Giorni del mese corrente
    for (let d = 1; d <= daysInCurrent; d++) {
        cells.push({
            day: d,
            monthDelta: 0,
            date: new Date(year, month, d),
        });
    }
    // Giorni del mese successivo (riempimento fino a 42 celle)
    let nextMonthDay = 1;
    while (cells.length < 42) {
        cells.push({
            day: nextMonthDay,
            monthDelta: 1,
            date: new Date(year, month + 1, nextMonthDay),
        });
        nextMonthDay++;
    }

    // --- Opzionale: Raggruppa per settimane con numeri ---
    let weeks: CalendarWeek[] | undefined = undefined;
    if (options.withWeekNumbers) {
        weeks = [];
        for (let w = 0; w < 6; w++) {
            const weekCells = cells.slice(w * 7, w * 7 + 7);
            const weekNumber = getISOWeekNumber(weekCells[0].date);
            weeks.push({
                weekNumber,
                days: weekCells,
            });
        }
    }

    // --- Ritorna ---
    return options.withWeekNumbers ? { cells, weeks } : { cells };
}

// ╔═══════════════════════════════════╗
// ║   Calcola numero settimana ISO    ║
// ╚═══════════════════════════════════╝
function getISOWeekNumber(date: Date) {
    // Porta la data al giovedì della settimana corrente (ISO)
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = (d.getUTCDay() + 6) % 7; // Lunedì = 0, Domenica = 6
    d.setUTCDate(d.getUTCDate() - dayNum + 3);

    // Primo giovedì dell'anno
    const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    const diff = d.getTime() - firstThursday.getTime();

    return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}
