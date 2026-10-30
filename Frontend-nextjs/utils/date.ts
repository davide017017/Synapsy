// ============================================
// Utility per formattazione data in italiano
// ============================================
export function formatDataIt(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// ============================================
// Utility per verifiche periodo corrente
// ============================================
export function isThisWeek(dateStr: string): boolean {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const date = new Date(dateStr);
    return date >= start && date < end;
}

export function isThisMonth(dateStr: string): boolean {
    const now = new Date();
    const date = new Date(dateStr);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

export function isThisYear(dateStr: string): boolean {
    const now = new Date();
    const date = new Date(dateStr);
    return date.getFullYear() === now.getFullYear();
}

// ============================================
// Utility per input di tipo "date"
// ============================================
export function toDateInputValue(date: Date): string {
    const tz = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tz).toISOString().split("T")[0];
}

// ============================================
// Chiave giorno locale "YYYY-MM-DD" (calendari + modale giorno)
// ============================================
const pad2 = (n: number) => String(n).padStart(2, "0");

export function localDateKey(d: Date): string {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function anyToLocalKey(val: Date | string): string {
    if (typeof val === "string") {
        // se è "YYYY-MM-DD" è già day-only
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
        return localDateKey(new Date(val));
    }
    return localDateKey(val);
}
