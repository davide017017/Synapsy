// ╔════════════════════════════════════════════╗
// ║      useTransactions: Solo GET (Lista)    ║
// ╚════════════════════════════════════════════╝

import { useEffect, useState } from "react";
import { Transaction } from "@/types/models/transaction";
import { fetchTransactions } from "@/lib/api/transactionsApi";

// ==============================
// Hook: Carica lista transazioni
// ==============================
export function useTransactions(token?: string) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
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
        fetchTransactions(token)
            .then(setTransactions)
            .catch((err) => setError(err.message || "Errore"))
            .finally(() => setLoading(false));
    }, [token]);

    return { transactions, loading, error };
}

