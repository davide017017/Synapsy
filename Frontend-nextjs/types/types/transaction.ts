// =======================================================
// types/types/transaction.ts
// Tipi per le transazioni finanziarie (con categoria)
// =======================================================

import { Category } from "./category";

/**
 * Transazione completa (con possibile categoria popolata)
 */
export type Transaction = {
    id: number;
    type: "entrata" | "spesa";
    description: string;
    amount: number;
    date: string;
    category_id?: number; // Solo se necessario (legacy/db)
    notes?: string | null;
    category?: Category; // Oggetto categoria completo, con color e icon
};

/**
 * Dati base per creazione/modifica transazione
 */
export type TransactionBase = {
    description: string;
    amount: number;
    type: "entrata" | "spesa";
    date: string;
    category_id?: number;
    notes?: string | null;
};

// =======================================================
