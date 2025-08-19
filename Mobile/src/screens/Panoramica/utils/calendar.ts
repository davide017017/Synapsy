// src/screens/Panoramica/utils/calendar.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generazione griglia mensile 7x5/6
// ─────────────────────────────────────────────────────────────────────────────
export type Day = { date: Date; inMonth: boolean };

export function monthMatrix(year: number, month: number): Day[][] {
    const first = new Date(year, month, 1);
    const start = new Date(first);
    const weekday = (first.getDay() + 6) % 7; // lun=0
    start.setDate(start.getDate() - weekday);
    const weeks: Day[][] = [];
    for (let w = 0; w < 6; w++) {
        const week: Day[] = [];
        for (let d = 0; d < 7; d++) {
            const cur = new Date(start);
            cur.setDate(start.getDate() + w * 7 + d);
            week.push({ date: cur, inMonth: cur.getMonth() === month });
        }
        weeks.push(week);
    }
    return weeks;
}

export function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

