// ==============================
// utils/unwrapApiArray.ts
// Scompatta array da varie forme di risposta Laravel/API
// Supporta: {data:{items:[]}}, {items:[]}, {data:[]}, [true,"msg",[]], [].
// ==============================

/**
 * Ritorna sempre un array "pulito" a prescindere dal wrapper.
 */
export function unwrapApiArray<T = any>(input: any): T[] {
    // ── Caso classico: { data: { items: [...] } }
    if (Array.isArray(input?.data?.items)) return input.data.items as T[];

    // ── Varianti frequenti
    if (Array.isArray(input?.items)) return input.items as T[];
    if (Array.isArray(input?.data)) return input.data as T[];

    // ── Tua forma legacy: [true, "msg", array]
    if (Array.isArray(input) && Array.isArray(input[2])) return input[2] as T[];

    // ── Array già "piatto"
    if (Array.isArray(input)) return input as T[];

    // ── Fallback: vuoto
    return [];
}
// ==============================
// END utils/unwrapApiArray.ts
// ==============================
