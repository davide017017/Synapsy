// ╔══════════════════════════════════════════════════════╗
// ║   useTransactionsApi: Mutazioni (CUD) Transazioni   ║
// ╚══════════════════════════════════════════════════════╝

import { useState } from "react";
import { Transaction } from "@/types/models/transaction";
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/api/transactionsApi";

type Status = "idle" | "loading" | "success" | "error";

// ==============================
// Hook: Mutazioni transazioni (CUD)
// ==============================
export function useTransactionsApi(token?: string) {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);

    // ───── CREATE ─────
    async function create(newTransaction: Omit<Transaction, "id">, type: "entrata" | "spesa") {
        if (!token) return null;
        setStatus("loading");
        setError(null);
        try {
            const data = await createTransaction(token, newTransaction, type);
            setStatus("success");
            return data;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore creazione");
            return null;
        }
    }

    // ───── UPDATE ─────
    async function update(transaction: Transaction) {
        if (!token) return null;
        setStatus("loading");
        setError(null);
        try {
            const data = await updateTransaction(token, transaction);
            setStatus("success");
            return data;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore update");
            return null;
        }
    }

    // ───── DELETE ─────
    async function remove(transaction: Transaction) {
        if (!token) return false;
        setStatus("loading");
        setError(null);
        try {
            await deleteTransaction(token, transaction);
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

