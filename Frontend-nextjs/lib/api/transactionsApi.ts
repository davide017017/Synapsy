// ╔══════════════════════════════════════════════════════╗
// ║           API: CRUD Transazioni (Entrate/Spese)     ║
// ╚══════════════════════════════════════════════════════╝

import { Transaction } from "@/types/types/transaction";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Fetch: Lista transazioni
// ==============================
export async function fetchTransactions(token: string): Promise<Transaction[]> {
    const res = await fetch(`${API_URL}/v1/financialoverview`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("Errore nel caricamento transazioni");
    const raw = await res.text();
    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : Object.values(data);
    } catch {
        throw new Error("Risposta non valida");
    }
}

// ==============================
// Create: Nuova transazione
// ==============================
export async function createTransaction(
    token: string,
    transaction: Omit<Transaction, "id">,
    type: "entrata" | "spesa"
): Promise<Transaction> {
    const endpoint = type === "entrata" ? "/v1/entrate" : "/v1/spese";
    const payload = { ...transaction, category_id: transaction.category?.id };
    delete (payload as any).category;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Errore creazione transazione");
    return await res.json();
}

// ==============================
// Update: Modifica transazione
// ==============================
export async function updateTransaction(token: string, transaction: Transaction): Promise<Transaction> {
    const type = transaction.category?.type;
    const endpoint = type === "entrata" ? `/v1/entrate/${transaction.id}` : `/v1/spese/${transaction.id}`;
    const payload = { ...transaction, category_id: transaction.category?.id };
    delete (payload as any).category;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Errore modifica transazione");
    return await res.json();
}

// ==============================
// Delete: Elimina transazione
// ==============================
export async function deleteTransaction(token: string, transaction: Transaction): Promise<boolean> {
    const type = transaction.category?.type;
    const endpoint = type === "entrata" ? `/v1/entrate/${transaction.id}` : `/v1/spese/${transaction.id}`;
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Errore eliminazione transazione");
    return true;
}
