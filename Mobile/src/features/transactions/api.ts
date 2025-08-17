import { api } from "@/lib/api";
import { asListFromSpese, asListFromEntrate } from "./shape";
import type { Transaction } from "./types";

export async function listTransactions(page = 1, perPage = 20): Promise<Transaction[]> {
    const params = { page, per_page: perPage };

    const [spese, entrate] = await Promise.all([api.get("/spese", { params }), api.get("/entrate", { params })]);

    const merged = [...asListFromSpese(spese.data), ...asListFromEntrate(entrate.data)];

    // Ordina per data decrescente (ISO o compatibile)
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
