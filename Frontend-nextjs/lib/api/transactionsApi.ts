// ╔══════════════════════════════════════════════════════╗
// ║           API: CRUD Transazioni (Entrate/Spese)     ║
// ╚══════════════════════════════════════════════════════╝

import { Transaction } from "@/types/types/transaction";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ======================================================
// Fetch: Lista transazioni (overview completa)
// ======================================================
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

// ======================================================
// Create: Nuova transazione (entrata/spesa)
// ======================================================
export async function createTransaction(
    token: string,
    transaction: Omit<Transaction, "id">,
    type: "entrata" | "spesa"
): Promise<Transaction> {
    const endpoint = type === "entrata" ? "/v1/entrate" : "/v1/spese";
    const url = `${API_URL}${endpoint}`;
    // Costruisci payload pulito
    const payload = {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        category_id: (transaction as any).category_id,
        notes: (transaction as any).notes,
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // Mostra errore in console con dettagli del payload
        const errJson = await res.json().catch(() => ({}));
        console.error("💥 Errore creazione transazione:", errJson);
        throw new Error(res.status === 422 ? "Validazione fallita" : "Errore creazione transazione");
    }

    return res.json();
}

// ======================================================
// Update: Modifica transazione (entrata/spesa)
// ======================================================
export async function updateTransaction(token: string, transaction: Transaction): Promise<Transaction> {
    // Usa il tipo dalla categoria oppure dalla proprietà type
    const type = transaction.category?.type || transaction.type;
    if (!type) throw new Error("Tipo transazione non riconosciuto");

    const endpoint = type === "entrata" ? `/v1/entrate/${transaction.id}` : `/v1/spese/${transaction.id}`;

    // Pulisci il payload (togli category per evitare errori lato backend)
    const payload = { ...transaction, category_id: transaction.category?.id };
    delete (payload as any).category;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Errore modifica transazione");
    return await res.json();
}

// ======================================================
// Delete: Elimina transazione (entrata/spesa)
// ======================================================
export async function deleteTransaction(token: string, transaction: Transaction): Promise<boolean> {
    // Usa il tipo dalla categoria oppure dalla proprietà type
    const type = transaction.category?.type || transaction.type;
    if (!type) throw new Error("Tipo transazione non riconosciuto");

    const endpoint = type === "entrata" ? `/v1/entrate/${transaction.id}` : `/v1/spese/${transaction.id}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error("Errore eliminazione transazione");
    return true;
}

// ════════════════════════════════════════════════════════
