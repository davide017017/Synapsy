// utils.ts
import { Transaction } from "@/types/types/transaction";
import { TransactionWithGroup } from "./types";

// Aggiunge monthGroup (YYYY-MM) a ogni transazione
export function addMonthGroup(transactions: Transaction[]): TransactionWithGroup[] {
    return transactions.map((t) => {
        const date = new Date(t.date);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return {
            ...t,
            monthGroup: `${year}-${month}`,
        };
    });
}

const mesiITA = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
];

// Ritorna "Giugno 2025" da "2025-06"
export function labelMeseAnno(yyyymm: string) {
    const [year, m] = yyyymm.split("-");
    const mese = mesiITA[parseInt(m, 10) - 1];
    return `${mese} ${year}`;
}
