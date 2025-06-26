// \types\types\transaction.ts

// types/types/transaction.ts
export type Transaction = {
    id: number;
    type: "entrata" | "spesa";
    description: string;
    amount: number;
    date: string;
    category_id?: number;
    notes?: string | null;
    // Aggiungi questo campo
    category?: {
        id: number;
        name: string;
        type: "entrata" | "spesa";
    };
};

// transazione senza ID (usata per creazione)
export type TransactionBase = {
    description: string;
    amount: number;
    type: "entrata" | "spesa";
    date: string;
    category_id?: number;
    notes?: string | null;
};
