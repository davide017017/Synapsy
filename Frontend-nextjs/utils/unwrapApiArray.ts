// ==============================
// utils/unwrapApiArray.ts
// Scompatta array provenienti dal backend Laravel/API
// Supporta: [true, "msg", dati] oppure array diretto
// ==============================

/**
 * Ritorna sempre un array "pulito" anche da risposte Laravel tipo [true, "msg", array]
 * @param input Dato grezzo dalla fetch API
 * @returns Array di oggetti, o array vuoto se non valido
 */
export function unwrapApiArray<T = any>(input: any): T[] {
    // Se arriva la forma [true, "msg", array], restituisce il terzo elemento (array vero)
    if (Array.isArray(input) && Array.isArray(input[2])) return input[2];
    // Se è già un array puro (già normalizzato)
    return Array.isArray(input) ? input : [];
}

// ==============================
// END utils/unwrapApiArray.ts
// ==============================
