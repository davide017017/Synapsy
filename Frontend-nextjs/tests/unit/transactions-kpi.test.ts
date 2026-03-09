// ──────────────────────────────────────────────────────────
// Test: Calcolo KPI sulle transazioni
// Replica la logica di TransactionsContext (monthBalance, etc.)
// senza dover montare il React Context
// ──────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach, vi } from "vitest";
import { toNum, parseYMD, typeOf } from "@/lib/finance";
import type { Transaction } from "@/types/models/transaction";

// ── Helpers locali (copiati dalla logica del context) ────────────────────────

function computeMonthBalance(transactions: Transaction[], now: Date): number {
    const y = now.getFullYear();
    const m = now.getMonth();
    return transactions
        .filter((t) => {
            const d = parseYMD(t.date);
            return d.getFullYear() === y && d.getMonth() === m;
        })
        .reduce((sum, t) => {
            const amt = toNum((t as any).amount);
            const tt = typeOf(t);
            return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
        }, 0);
}

function computeYearBalance(transactions: Transaction[], now: Date): number {
    const y = now.getFullYear();
    return transactions
        .filter((t) => parseYMD(t.date).getFullYear() === y)
        .reduce((sum, t) => {
            const amt = toNum((t as any).amount);
            const tt = typeOf(t);
            return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
        }, 0);
}

function computeTotalBalance(transactions: Transaction[]): number {
    return transactions.reduce((sum, t) => {
        const amt = toNum((t as any).amount);
        const tt = typeOf(t);
        return sum + (tt === "entrata" ? amt : tt === "spesa" ? -amt : 0);
    }, 0);
}

// ── Fixture ──────────────────────────────────────────────────────────────────

function makeEntrata(id: number, amount: number, date: string): Transaction {
    return { id, amount, date, type: "entrata", description: `Entrata ${id}` } as unknown as Transaction;
}

function makeSpesa(id: number, amount: number, date: string): Transaction {
    return { id, amount, date, type: "spesa", description: `Spesa ${id}` } as unknown as Transaction;
}

// ─────────────────────────────────
// Test suite
// ─────────────────────────────────

describe("KPI: computeMonthBalance", () => {
    const now = new Date("2024-03-15");

    it("ritorna 0 con lista vuota", () => {
        expect(computeMonthBalance([], now)).toBe(0);
    });

    it("somma solo le transazioni del mese corrente", () => {
        const txs = [
            makeEntrata(1, 1000, "2024-03-10"), // nel mese
            makeEntrata(2, 500, "2024-02-20"),  // mese precedente
            makeSpesa(3, 200, "2024-03-05"),    // nel mese
        ];
        expect(computeMonthBalance(txs, now)).toBeCloseTo(800); // 1000 - 200
    });

    it("gestisce entrate e uscite dello stesso mese", () => {
        const txs = [
            makeEntrata(1, 2000, "2024-03-01"),
            makeSpesa(2, 300, "2024-03-15"),
            makeSpesa(3, 700, "2024-03-28"),
        ];
        expect(computeMonthBalance(txs, now)).toBeCloseTo(1000);
    });
});

describe("KPI: computeYearBalance", () => {
    const now = new Date("2024-06-01");

    it("ritorna 0 con lista vuota", () => {
        expect(computeYearBalance([], now)).toBe(0);
    });

    it("include tutti i mesi dell'anno corrente", () => {
        const txs = [
            makeEntrata(1, 1000, "2024-01-01"),
            makeEntrata(2, 1000, "2024-06-15"),
            makeEntrata(3, 1000, "2023-12-31"), // anno precedente — escluso
            makeSpesa(4, 500, "2024-03-10"),
        ];
        expect(computeYearBalance(txs, now)).toBeCloseTo(1500); // 2000 - 500
    });
});

describe("KPI: computeTotalBalance", () => {
    it("ritorna 0 con lista vuota", () => {
        expect(computeTotalBalance([])).toBe(0);
    });

    it("calcola il saldo totale cumulativo", () => {
        const txs = [
            makeEntrata(1, 5000, "2023-01-01"),
            makeEntrata(2, 3000, "2024-05-10"),
            makeSpesa(3, 1500, "2022-08-20"),
        ];
        expect(computeTotalBalance(txs)).toBeCloseTo(6500);
    });

    it("usa category.type se disponibile (precedenza su type)", () => {
        // Simula una transazione dove il tipo è nella categoria
        const tx = {
            id: 99,
            amount: 100,
            date: "2024-01-01",
            type: "entrata",
            category: { id: 1, type: "spesa" }, // la categoria dice spesa
        } as unknown as Transaction;

        expect(computeTotalBalance([tx])).toBeCloseTo(-100); // negativo perché spesa
    });

    it("gestisce amount come stringa (normalizzazione)", () => {
        const tx = {
            id: 1,
            amount: "1.234,56",
            date: "2024-01-01",
            type: "entrata",
        } as unknown as Transaction;
        expect(computeTotalBalance([tx])).toBeCloseTo(1234.56);
    });
});
