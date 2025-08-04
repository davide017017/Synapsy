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
