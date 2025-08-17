import { asCategory } from "../categories/shape";
import type { Transaction } from "./types";

// ── helpers ──────────────────────────────────────────────────────────────────
const base = (d: any) => ({
    id: Number(d?.id ?? 0),
    description: d?.description ?? d?.descrizione ?? "",
    amount: Number(d?.amount ?? d?.importo ?? 0),
    date: d?.date ?? d?.data ?? "",
    category: d?.category ? asCategory(d.category) : undefined,
    notes: d?.notes ?? d?.nota ?? d?.note ?? null,
});

export const asSpesa = (d: any): Transaction => ({
    ...base(d),
    type: "spesa",
});

export const asEntrata = (d: any): Transaction => ({
    ...base(d),
    type: "entrata",
});

// accetta sia array diretto che { data: [...] }
const arr = (payload: any): any[] =>
    Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

export const asListFromSpese = (payload: any): Transaction[] => arr(payload).map(asSpesa);
export const asListFromEntrate = (payload: any): Transaction[] => arr(payload).map(asEntrata);
