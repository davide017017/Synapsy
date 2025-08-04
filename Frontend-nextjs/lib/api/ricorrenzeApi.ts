// ╔═══════════════════════════════════════════════════════════╗
// ║      ricorrenzeApi.ts — Chiamate CRUD alle Ricorrenze    ║
// ╚═══════════════════════════════════════════════════════════╝

import { Ricorrenza, RicorrenzaBase } from "@/types/models/ricorrenza";

// ==============================
// URL BASE (usa variabile ENV)
// ==============================
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Funzione di mapping frequenza IT → EN per backend
// ==============================
function frequencyToBackend(freq: string): string {
    switch (freq.toLowerCase()) {
        case "giornaliero":
        case "daily":
            return "daily";
        case "settimanale":
        case "weekly":
            return "weekly";
        case "mensile":
        case "monthly":
            return "monthly";
        case "annuale":
        case "annually":
        case "yearly":
            return "annually";
        default:
            console.warn("Valore frequenza sconosciuto! Uso 'monthly'. Ricevuto:", freq);
            return "monthly";
    }
}

// ==============================
// Fetch: Lista ricorrenze
// ==============================
export async function fetchRicorrenze(token: string): Promise<Ricorrenza[]> {
    const res = await fetch(`${API_URL}/v1/recurring-operations`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("Errore fetch ricorrenze");

    // Accetta array o oggetto indicizzato (come Laravel a volte restituisce)
    const raw = await res.text();
    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : Object.values(data);
    } catch {
        throw new Error("Risposta non valida dal server");
    }
}

// ==============================
// Create: Nuova ricorrenza
// ==============================
export async function createRicorrenza(token: string, data: RicorrenzaBase): Promise<Ricorrenza> {
    // --- Mapping IT → EN, + campi obbligatori ---
    const payload = {
        description: data.nome, // "nome" → "description"
        amount: data.importo, // "importo" → "amount"
        frequency: frequencyToBackend(data.frequenza), // IT → EN
        interval: data.interval || 1, // default 1
        start_date: data.prossima, // "prossima" → "start_date"
        is_active: data.is_active ?? 1, // default 1
        category_id: data.category_id,
        notes: data.notes ?? "",
        type: data.type, // opzionale, se richiesto
    };

    const res = await fetch(`${API_URL}/v1/recurring-operations`, {
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
        console.error("💥 Payload non valido:", errJson);
        throw new Error(res.status === 422 ? "Validazione fallita" : "Errore creazione ricorrenza");
    }

    return res.json();
}

// ==============================
// Update: Modifica ricorrenza
// ==============================
export async function updateRicorrenza(token: string, id: number, data: RicorrenzaBase): Promise<Ricorrenza> {
    const payload = {
        description: data.nome,
        amount: data.importo,
        frequency: frequencyToBackend(data.frequenza),
        interval: data.interval || 1,
        start_date: data.prossima,
        is_active: Number(data.is_active ?? 1),
        category_id: data.category_id,
        notes: data.notes ?? "",
        type: data.type,
    };

    const res = await fetch(`${API_URL}/v1/recurring-operations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Errore update ricorrenza");
    return await res.json();
}

// ==============================
// Delete: Elimina ricorrenza
// ==============================
export async function deleteRicorrenza(token: string, ricorrenza: Ricorrenza): Promise<void> {
    const res = await fetch(`${API_URL}/v1/recurring-operations/${ricorrenza.id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("Errore delete ricorrenza");
}

// ═══════════════════════════════════════════════════════════

