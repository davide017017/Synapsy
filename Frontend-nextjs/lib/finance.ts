// ╔══════════════════════════════════════════════════════╗
// ║ lib/finance.ts — Helpers condivisi (importi, date)  ║
// ╚══════════════════════════════════════════════════════╝

import type { Transaction } from "@/types";

// ──────────────────────────────────────────────────────
// Normalizza numeri: supporta number, "1.234,56", "1234.56"
// ──────────────────────────────────────────────────────
export function toNum(v: unknown): number {
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    if (typeof v === "string") {
        const s = v.trim();
        if (!s) return 0;
        const normalized = s.replace(/\./g, "").replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

// ──────────────────────────────────────────────────────
// Parse "YYYY-MM-DD" in locale (no shift UTC)
// ──────────────────────────────────────────────────────
export function parseYMD(ymd: string): Date {
    const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
    const dt = new Date();
    dt.setFullYear(y, (m || 1) - 1, d || 1);
    dt.setHours(0, 0, 0, 0);
    return dt;
}

// ──────────────────────────────────────────────────────
// Heuristica: importi in centesimi? (≥20% >= 10_000)
// ──────────────────────────────────────────────────────
export function detectAmountsAreCents(transactions: Pick<Transaction, "amount">[], sampleSize = 100): boolean {
    const sample = transactions
        .slice(0, sampleSize)
        .map((t) => Math.abs(toNum((t as any).amount)))
        .filter(Boolean);
    if (!sample.length) return false;
    const over10k = sample.filter((n) => n >= 10_000).length;
    return over10k / sample.length >= 0.2;
}

// ──────────────────────────────────────────────────────
// Factory: amountOf con flag centesimi già deciso
// ──────────────────────────────────────────────────────
export function makeAmountOf(amountsAreCents: boolean) {
    return (t: Pick<Transaction, "amount">) => {
        const n = toNum((t as any).amount);
        return amountsAreCents ? n / 100 : n;
    };
}

// ──────────────────────────────────────────────────────
// Tipo coerente: preferisci category?.type poi type
// ──────────────────────────────────────────────────────
export function typeOf(t: Transaction): "entrata" | "spesa" | undefined {
    return (t as any).category?.type || (t as any).type;
}

// ──────────────────────────────────────────────────────
// Descrizione file:
// Helpers unificati per importi e date. Usali ovunque
// serva sommare/filtrare: niente duplicazione, risultati
// coerenti tra tabella e HeroSaldo.
// ──────────────────────────────────────────────────────
