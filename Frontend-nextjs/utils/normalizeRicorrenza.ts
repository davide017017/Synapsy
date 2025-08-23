// ============================
// utils/normalizeRicorrenza.ts
// Converte risposta backend → shape Ricorrenza per la UI
// ============================

import { Ricorrenza } from "@/types/models/ricorrenza";

// ─────────────────────────────────────────────────────────────
// Sezione: util numeri / flag
// ─────────────────────────────────────────────────────────────
const toNum = (v: unknown) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
        const n = Number(v.replace(",", "."));
        return Number.isFinite(n) ? n : 0;
    }
    return 0;
};

const toBool = (v: unknown): boolean => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "string") return ["1", "true", "TRUE", "True", "yes", "on"].includes(v);
    return false;
};

// ─────────────────────────────────────────────────────────────
// Sezione: normalizzazione principale
// ─────────────────────────────────────────────────────────────
export function normalizeRicorrenza(r: any): Ricorrenza {
    return {
        id: Number(r.id),

        // ── campi usati dalla tua UI (ITA)
        nome: r.nome || r.description || "",
        importo: typeof r.importo !== "undefined" ? toNum(r.importo) : toNum(r.amount),
        frequenza: r.frequenza || r.frequency || "monthly",
        prossima: r.next_occurrence_date ?? r.prossima ?? r.start_date ?? null,

        category_id: Number(r.category_id ?? 0),
        categoria: r.categoria || (r.category?.name ?? ""),
        category_color: r.category_color || r.category?.color || "",

        notes: r.note ?? r.notes ?? "",
        type: r.type === "entrata" ? "entrata" : r.category?.type ?? "spesa",

        is_active: typeof r.is_active !== "undefined" ? toBool(r.is_active) : true,

        interval: typeof r.interval !== "undefined" ? Number(r.interval) : 1,
    } as Ricorrenza;
}

// ============================
// END utils/normalizeRicorrenza.ts
// ============================
