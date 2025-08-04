// ============================
// utils/normalizeRicorrenza.ts
// Converte qualsiasi risposta "ricorrenza" dal backend
// nello shape Ricorrenza usato nel frontend
// ============================

import { Ricorrenza } from "@/types/models/ricorrenza";

// -----------------------------------
// Funzione: Normalizza Ricorrenza
// -----------------------------------

/**
 * Trasforma un oggetto generico del backend in Ricorrenza
 * @param r Oggetto grezzo dal backend (può avere chiavi diverse)
 * @returns Ricorrenza standardizzata per il frontend
 */
export function normalizeRicorrenza(r: any): Ricorrenza {
    return {
        id: r.id,
        nome: r.nome || r.description || "",
        importo: typeof r.importo !== "undefined" ? Number(r.importo) : Number(r.amount) || 0,
        frequenza: r.frequenza || r.frequency || "non specificata",
        prossima: r.prossima || r.next_occurrence_date || r.start_date || "",
        category_id: r.category_id,
        categoria: r.categoria || (r.category?.name ?? ""), // fallback: usa il nome categoria se presente
        category_color: r.category_color || r.category?.color || "", // ← sempre valorizzato
        notes: r.note ?? r.notes ?? "",
        type: r.type || (r.category?.type ?? "spesa"),
        is_active: typeof r.is_active !== "undefined" ? r.is_active : true, // fallback true
        interval: typeof r.interval !== "undefined" ? Number(r.interval) : 1, // fallback 1
    };
}

// ============================
// END utils/normalizeRicorrenza.ts
// ============================

