// src/features/transactions/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// API transazioni: list / update / delete (spese | entrate)
// BaseURL è ENV.API_BASE_URL (es: http://host:8484/api/v1), quindi usiamo "/spese" | "/entrate"
// ─────────────────────────────────────────────────────────────────────────────

import { api } from "@/lib/api";
import { asListFromSpese, asListFromEntrate } from "./shape";
import type { Transaction } from "./types";

// ── Helpers endpoint ─────────────────────────────────────────────────────────
export type TxType = "entrata" | "spesa";

function endpointFor(type: TxType, id?: string | number) {
    const base = type === "spesa" ? "/spese" : "/entrate";
    return id ? `${base}/${id}` : base;
}

// ── List (merge spese+entrate) ───────────────────────────────────────────────
export async function listTransactions(page = 1, perPage = 20): Promise<Transaction[]> {
    const params = { page, per_page: perPage };
    const [spese, entrate] = await Promise.all([api.get("/spese", { params }), api.get("/entrate", { params })]);

    const merged = [...asListFromSpese(spese.data), ...asListFromEntrate(entrate.data)];
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Tipi payload update ──────────────────────────────────────────────────────
export type UpdateTxPayload = {
    description?: string;
    amount?: number;
    date?: string; // ISO
    notes?: string;
    category_id?: string | number;
};

// ── Update (PATCH) ───────────────────────────────────────────────────────────
export async function updateTransaction(id: string | number, type: TxType, data: UpdateTxPayload) {
    const url = endpointFor(type, id);
    const res = await api.patch(url, data);
    return res.data;
}

// ── Delete ───────────────────────────────────────────────────────────────────
export async function deleteTransaction(id: string | number, type: TxType) {
    const url = endpointFor(type, id);
    await api.delete(url);
    return true;
}
