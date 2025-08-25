// ╔══════════════════════════════════════════════════════╗
// ║           API: CRUD Transazioni (Entrate/Spese)     ║
/* ╚══════════════════════════════════════════════════════╝ */

import type { Transaction } from "@/types/models/transaction";
import { url } from "@/lib/api/endpoints";

/* ======================================================
 * Fetch: Lista transazioni (overview completa)
 * - supporta AbortController via parametro opzionale `signal`
 * ====================================================== */
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
    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : Object.values(data);
    } catch {
        throw new Error("Risposta non valida");
    }
}

/* ======================================================
 * Create: Nuova transazione (entrata/spesa)
 * ====================================================== */
export async function createTransaction(
    token: string,
    transaction: Omit<Transaction, "id">,
    type: "entrata" | "spesa"
): Promise<Transaction> {
    const endpoint = type === "entrata" ? url("entrate") : url("spese");

    // Payload pulito
    const payload = {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type, // facoltativo lato backend; mantenuto per compatibilità
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
        const errJson = await res.json().catch(() => ({}));
        console.error("💥 Errore creazione transazione:", errJson);
        throw new Error(res.status === 422 ? "Validazione fallita" : "Errore creazione transazione");
    }

    return res.json();
}

/* ======================================================
 * Update: Modifica transazione (entrata/spesa)
 * ====================================================== */
export async function updateTransaction(token: string, transaction: Transaction): Promise<Transaction> {
    // Usa il tipo dalla categoria oppure dalla proprietà type
    const type = transaction.category?.type || transaction.type;
    if (!type) throw new Error("Tipo transazione non riconosciuto");

    const endpoint = type === "entrata" ? url("entrate", transaction.id) : url("spese", transaction.id);

    // Pulisci il payload: niente oggetti annidati
    const { id: _omitId, category: _omitCategory, ...rest } = transaction as unknown as Record<string, any>;

    const payload = {
        ...rest,
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

/* ======================================================
 * Delete: Elimina transazione (entrata/spesa)
 * ====================================================== */
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

/* ======================================================
 * Soft move: cambia tipo di transazione (da entrata a spesa o viceversa)
 * - Crea una nuova transazione nel nuovo tipo, poi cancella l’originale
 *   (NB: se preferisci sicurezza > consistenza temporanea, inverti l’ordine)
 * ====================================================== */
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
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!resDelete.ok) {
        const err = await resDelete.json().catch(() => ({}));
        console.error("💥 Errore softMove DELETE:", err);
        throw new Error("Errore eliminazione vecchia transazione");
    }

    // 2) Crea la nuova col nuovo tipo
    const createEndpoint = newType === "entrata" ? url("entrate") : url("spese");

    const payload = {
        description: formData.description,
        amount: formData.amount,
        date: formData.date,
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
        const err = await resCreate.json().catch(() => ({}));
        console.error("💥 Errore softMove CREATE:", err);
        throw new Error("Errore creazione nuova transazione");
    }

    return resCreate.json();
}
