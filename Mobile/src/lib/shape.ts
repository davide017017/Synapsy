// ──────────────────────────────────────────────────
// Helpers per uniformare le risposte API
// ──────────────────────────────────────────────────
export function asList<T = any>(payload: any): T[] {
    if (Array.isArray(payload)) return payload;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    return [];
}
