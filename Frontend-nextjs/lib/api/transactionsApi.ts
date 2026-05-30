// ╔══════════════════════════════════════════════════════╗
// ║           API: CRUD Transazioni (Entrate/Spese)     ║
// ╚══════════════════════════════════════════════════════╝

import type { Transaction } from "@/types/models/transaction";
import { url } from "@/lib/api/endpoints";
import { toNum } from "@/lib/finance";

// ──────────────────────────────────────────────────────
// Fetch: lista transazioni (normalizza amount, NON toISOString su date)
// ──────────────────────────────────────────────────────
export async function fetchTransactions(token: string, signal?: AbortSignal): Promise<Transaction[]> {
    const res = await fetch(`${url("financialOverview")}?sort_by=date&sort_direction=desc`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        signal,
    });

    if (!res.ok) throw new Error("Errore nel caricamento transazioni");

    const raw = await res.text();

    let data: any[];
    try {
        const parsed = JSON.parse(raw);
        data = Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch {
        throw new Error("Risposta non valida");
    }

    // ⚠ Mantieni `t.date` così com'è (es. "YYYY-MM-DD") per evitare shift di fuso
    const normalized: Transaction[] = data.map((t: any) => ({
        ...t,
        amount: toNum(t.amount),
        date: t.date, // ← niente toISOString()
    }));

    return normalized;
}

// ──────────────────────────────────────────────────────
// Create: nuova transazione (force number su amount, accetta date stringa)
// ──────────────────────────────────────────────────────
export async function createTransaction(
    token: string,
    transaction: Omit<Transaction, "id">,
    type: "entrata" | "spesa"
): Promise<Transaction> {
    const endpoint = type === "entrata" ? url("entrate") : url("spese");

    const payload = {
        description: transaction.description,
        amount: toNum(transaction.amount), // ← più robusto di Number()
        date: transaction.date, // ← stringa "YYYY-MM-DD" dal form
        type: transaction.type,
        category_id: (transaction as any).category_id,
        notes: (transaction as any).notes,
    };

    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(res.status === 422 ? "Validazione fallita" : "Errore creazione transazione");
    }

    return res.json();
}

// ──────────────────────────────────────────────────────
// Update: modifica transazione (force number su amount)
// ──────────────────────────────────────────────────────
export async function updateTransaction(token: string, transaction: Transaction): Promise<Transaction> {
    const type = transaction.category?.type || transaction.type;
    if (!type) throw new Error("Tipo transazione non riconosciuto");

    const endpoint = type === "entrata" ? url("entrate", transaction.id) : url("spese", transaction.id);

    const { id: _omitId, category: _omitCategory, ...rest } = transaction as unknown as Record<string, any>;
    const payload = {
        ...rest,
        amount: toNum(transaction.amount),
        category_id: transaction.category?.id ?? (transaction as any).category_id,
    };

    const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Errore modifica transazione");
    return res.json();
}

// ──────────────────────────────────────────────────────
// Delete: elimina transazione
// ──────────────────────────────────────────────────────
export async function deleteTransaction(token: string, transaction: Transaction): Promise<boolean> {
    const type = transaction.category?.type || transaction.type;
    if (!type) throw new Error("Tipo transazione non riconosciuto");

    const endpoint = type === "entrata" ? url("entrate", transaction.id) : url("spese", transaction.id);

    const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error("Errore eliminazione transazione");
    return true;
}

// ──────────────────────────────────────────────────────
// Soft move: cambia tipo (delete vecchia → create nuova)
// ──────────────────────────────────────────────────────
export async function softMoveTransaction(
    token: string,
    original: Transaction,
    formData: Transaction,
    newType: "entrata" | "spesa"
): Promise<Transaction> {
    // 1) Elimina la vecchia
    const typeOld = original.category?.type || original.type;
    if (!typeOld) throw new Error("Tipo transazione originale non riconosciuto");

    const deleteEndpoint = typeOld === "entrata" ? url("entrate", original.id) : url("spese", original.id);
    const resDelete = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!resDelete.ok) {
        throw new Error("Errore eliminazione vecchia transazione");
    }

    // 2) Crea la nuova col nuovo tipo
    const createEndpoint = newType === "entrata" ? url("entrate") : url("spese");
    const payload = {
        description: formData.description,
        amount: toNum(formData.amount),
        date: formData.date, // ← lascia "YYYY-MM-DD"
        type: newType,
        category_id: (formData as any).category_id,
        notes: (formData as any).notes,
    };

    const resCreate = await fetch(createEndpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!resCreate.ok) {
        throw new Error("Errore creazione nuova transazione");
    }

    return resCreate.json();
}

// ──────────────────────────────────────────────────────
// Descrizione file:
// API transazioni con dati coerenti senza shift di fuso.
// - `fetchTransactions`: amount→number, date lasciata come "YYYY-MM-DD".
// - payload: `toNum()` su amount per robustezza.
// Evita errori nei calcoli per mese/settimana/anno.
// ──────────────────────────────────────────────────────
