// ╔══════════════════════════════════════════════════════╗
// ║     useRicorrenzeApi: Mutazioni (CUD) Ricorrenze    ║
// ╚══════════════════════════════════════════════════════╝

import { useState } from "react";
import { Ricorrenza } from "@/types/models/ricorrenza";
import { createRicorrenza, updateRicorrenza, deleteRicorrenza } from "@/lib/api/ricorrenzeApi";

type Status = "idle" | "loading" | "success" | "error";

// ==============================
// Hook: Mutazioni ricorrenze (CUD)
// ==============================
export function useRicorrenzeApi(token?: string) {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);

    // ───── CREATE ─────
    async function create(newRicorrenza: Omit<Ricorrenza, "id">) {
        if (!token) return null;
        setStatus("loading");
        setError(null);
        try {
            const data = await createRicorrenza(token, newRicorrenza);
            setStatus("success");
            return data;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore creazione");
            return null;
        }
    }

    // ───── UPDATE ─────
    async function update(ricorrenza: Ricorrenza) {
        if (!token) return null;
        setStatus("loading");
        setError(null);

        try {
            // De-struttura l'id e prendi solo i dati da inviare (RicorrenzaBase)
            const { id, ...data } = ricorrenza;
            // Passa id separato e il resto come "data"
            const updated = await updateRicorrenza(token, id, data);
            setStatus("success");
            return updated;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore update");
            return null;
        }
    }

    // ───── DELETE ─────
    async function remove(ricorrenza: Ricorrenza) {
        if (!token) return false;
        setStatus("loading");
        setError(null);
        try {
            await deleteRicorrenza(token, ricorrenza);
            setStatus("success");
            return true;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore delete");
            return false;
        }
    }

    // ───── Reset stato (opzionale) ─────
    function reset() {
        setStatus("idle");
        setError(null);
    }

    return { create, update, remove, status, error, reset };
}
