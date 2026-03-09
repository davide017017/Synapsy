// ──────────────────────────────────────────────────────────
// Test: lib/finance.ts
// Copertura: toNum, parseYMD, typeOf
// ──────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { toNum, parseYMD, typeOf } from "@/lib/finance";
import type { Transaction } from "@/types/models/transaction";

// ─────────────────────────────────
// toNum
// ─────────────────────────────────
describe("toNum", () => {
    it("restituisce il numero passato direttamente", () => {
        expect(toNum(42)).toBe(42);
        expect(toNum(3.14)).toBeCloseTo(3.14);
        expect(toNum(0)).toBe(0);
    });

    it("converte stringa semplice in numero", () => {
        expect(toNum("100")).toBe(100);
        expect(toNum("3.14")).toBeCloseTo(3.14);
        expect(toNum("0")).toBe(0);
    });

    it("converte formato italiano (virgola decimale)", () => {
        expect(toNum("1,50")).toBeCloseTo(1.5);
        expect(toNum("99,99")).toBeCloseTo(99.99);
    });

    it("converte formato italiano con separatore migliaia", () => {
        expect(toNum("1.234,56")).toBeCloseTo(1234.56);
        expect(toNum("10.000,00")).toBeCloseTo(10000.0);
    });

    it("restituisce 0 per valori invalidi", () => {
        expect(toNum("")).toBe(0);
        expect(toNum("   ")).toBe(0);
        expect(toNum("abc")).toBe(0);
        expect(toNum(NaN)).toBe(0);
        expect(toNum(Infinity)).toBe(0);
        expect(toNum(null)).toBe(0);
        expect(toNum(undefined)).toBe(0);
    });
});

// ─────────────────────────────────
// parseYMD
// ─────────────────────────────────
describe("parseYMD", () => {
    it("parsa una data ISO YYYY-MM-DD in locale (no UTC shift)", () => {
        const d = parseYMD("2024-03-15");
        expect(d.getFullYear()).toBe(2024);
        expect(d.getMonth()).toBe(2); // 0-based → marzo = 2
        expect(d.getDate()).toBe(15);
        expect(d.getHours()).toBe(0);
        expect(d.getMinutes()).toBe(0);
    });

    it("parsa il primo gennaio", () => {
        const d = parseYMD("2024-01-01");
        expect(d.getFullYear()).toBe(2024);
        expect(d.getMonth()).toBe(0);
        expect(d.getDate()).toBe(1);
    });

    it("parsa il 31 dicembre", () => {
        const d = parseYMD("2024-12-31");
        expect(d.getFullYear()).toBe(2024);
        expect(d.getMonth()).toBe(11);
        expect(d.getDate()).toBe(31);
    });
});

// ─────────────────────────────────
// typeOf
// ─────────────────────────────────
describe("typeOf", () => {
    it("usa il tipo della categoria se disponibile", () => {
        const tx = {
            id: 1,
            type: "entrata",
            category: { id: 1, type: "spesa" },
        } as unknown as Transaction;
        expect(typeOf(tx)).toBe("spesa");
    });

    it("fallback al type diretto se category mancante", () => {
        const tx = { id: 1, type: "entrata" } as unknown as Transaction;
        expect(typeOf(tx)).toBe("entrata");
    });

    it("restituisce undefined se nessun tipo disponibile", () => {
        const tx = { id: 1 } as unknown as Transaction;
        expect(typeOf(tx)).toBeUndefined();
    });
});
