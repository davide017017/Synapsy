// app/(protected)/home/hooks/useUpcomingPayments.ts
// ======================================================================
// Hook: prossimi pagamenti/incassi (ricorrenze + spese/entrate manuali
// future) dall'endpoint /api/v1/financialoverview/upcoming.
// Stesso pattern di autenticazione usato dai *Context esistenti.
// ======================================================================

"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { fetchUpcomingPayments, UpcomingEntry } from "@/lib/api/upcomingApi";

export function useUpcomingPayments(days = 30, limit = 8) {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    const [entries, setEntries] = useState<UpcomingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        const controller = new AbortController();

        setLoading(true);
        setError(null);

        fetchUpcomingPayments(token, days, limit, controller.signal)
            .then(setEntries)
            .catch((e: any) => {
                if (e?.name === "AbortError") return;
                if (e?.message === "Unauthorized") {
                    signOut({ callbackUrl: "/login" });
                    return;
                }
                setError(e?.message || "Errore caricamento prossimi pagamenti");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [token, days, limit]);

    return { entries, loading, error };
}

// ----------------------------------------------------------------------
// Descrizione file:
// Fetch dei prossimi pagamenti estratto da ProssimiPagamentiCard per
// riusarlo nella Home mobile (card Prossimi + pallini rossi del calendario).
// Il backend accetta limit max 20 e days max 90.
// ----------------------------------------------------------------------
