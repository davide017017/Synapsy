// utils.ts
import { Transaction } from "@/types/models/transaction";
import { TransactionWithGroup } from "@/types/transazioni/list";

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

// Converte #RRGGBB in stringa HSL "h s l"
export function hexToHSL(hex: string): string {
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h = 0,
        s = 0,
        l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

