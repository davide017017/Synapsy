// src/features/transactions/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// API transazioni: lista (spese+entrate), update, delete
// ─────────────────────────────────────────────────────────────────────────────
import { api } from "@/lib/api";
import { asListFromSpese, asListFromEntrate } from "./shape";
import type { Transaction } from "./types";

// ── Helpers ──────────────────────────────────────────────────────────────────
type TxType = "entrata" | "spesa";
const basePath = (type: TxType) => (type === "spesa" ? "/spese" : "/entrate");

// ─────────────────────────────────────────────────────────────────────────────
// LIST: merge spese+entrate e ordina per data desc
// ─────────────────────────────────────────────────────────────────────────────
export async function listTransactions(page = 1, perPage = 20): Promise<Transaction[]> {
    const params = { page, per_page: perPage };
    const [spese, entrate] = await Promise.all([
        api.get(basePath("spesa"), { params }),
        api.get(basePath("entrata"), { params }),
    ]);

    const merged: Transaction[] = [...asListFromSpese(spese.data), ...asListFromEntrate(entrate.data)];

    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE: patch su /spese/:id oppure /entrate/:id
// payload: qualunque subset (description, amount, notes, date, category_id)
// ─────────────────────────────────────────────────────────────────────────────
export type UpdateTxPayload = Partial<{
    description: string;
    amount: number;
    notes: string;
    date: string; // ISO
    category_id: string | number;
}>;

export async function updateTransaction(id: string | number, type: TxType, payload: UpdateTxPayload): Promise<void> {
    await api.patch(`${basePath(type)}/${id}`, payload);
}

// ─────────────────────────────────────────────────────────────────────────────
export async function deleteTransaction(id: string | number, type: TxType): Promise<void> {
    await api.delete(`${basePath(type)}/${id}`);
}
