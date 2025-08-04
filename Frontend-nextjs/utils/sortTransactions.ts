import { Transaction } from "../types/models/transaction";

export function sortTransactions(list: Transaction[], sortBy: "date" | "amount", sortDirection: "asc" | "desc") {
    return [...list].sort((a, b) => {
        let valA = sortBy === "date" ? new Date(a.date).getTime() : a.amount;
        let valB = sortBy === "date" ? new Date(b.date).getTime() : b.amount;
        return sortDirection === "asc" ? valA - valB : valB - valA;
    });
}

