// ╔════════════════════════════════════════════╗
// ║       useRicorrenze: Solo GET (Lista)     ║
// ╚════════════════════════════════════════════╝

import { useEffect, useState } from "react";
import { Ricorrenza } from "@/types/types/ricorrenza";
import { fetchRicorrenze } from "@/lib/api/ricorrenzeApi";

// ==============================
// Hook: Carica lista ricorrenze
// ==============================
export function useRicorrenze(token?: string) {
    const [ricorrenze, setRicorrenze] = useState<Ricorrenza[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Token mancante");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        fetchRicorrenze(token)
            .then(setRicorrenze)
            .catch((err) => setError(err.message || "Errore"))
            .finally(() => setLoading(false));
    }, [token]);

    return { ricorrenze, setRicorrenze, loading, error };
}
