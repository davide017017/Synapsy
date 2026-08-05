// ╔══════════════════════════════════════════════════════════╗
// ║  upcomingApi.ts — Fetch: Prossimi pagamenti/incassi      ║
// ╚══════════════════════════════════════════════════════════╝

import { url } from "@/lib/api/endpoints";
import { toNum } from "@/lib/finance";

// ==============================
// Tipo: voce "prossimo pagamento"
// (ricorrenza o spesa/entrata manuale con data futura)
// ==============================
export interface UpcomingEntry {
    id: number;
    type: "spesa" | "entrata";
    source: "manuale" | "ricorrenza";
    date: string;
    amount: number;
    description: string;
    category_name: string | null;
}

// ==============================
// Fetch: prossimi pagamenti/incassi
// GET /api/v1/financialoverview/upcoming?days=X&limit=Y
// ==============================
export async function fetchUpcomingPayments(
    token: string,
    days = 30,
    limit = 8,
    signal?: AbortSignal,
): Promise<UpcomingEntry[]> {
    const res = await fetch(`${url("financialOverview")}/upcoming?days=${days}&limit=${limit}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        signal,
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(json?.message || "Errore fetch prossimi pagamenti");
    }

    const items = Array.isArray(json?.data) ? json.data : [];

    return items.map(
        (r: any): UpcomingEntry => ({
            id: Number(r.id),
            type: r.type === "entrata" ? "entrata" : "spesa",
            source: r.source === "ricorrenza" ? "ricorrenza" : "manuale",
            date: r.date,
            amount: toNum(r.amount),
            description: r.description || "",
            category_name: r.category_name ?? null,
        }),
    );
}

// ═══════════════════════════════════════════════════════════
