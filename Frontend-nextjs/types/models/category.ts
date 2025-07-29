// =======================================================
// category.ts
// Tipi per le categorie delle transazioni
// =======================================================

/**
 * Categoria transazione
 */
import type { CategoryIconName } from "@/utils/categoryOptions";

export type Category = {
    id: number;
    name: string;
    type: "entrata" | "spesa";
    color: string;
    icon: CategoryIconName;
};

/**
 * Dati base categoria (usati per create/update)
 */
export type CategoryBase = {
    name: string;
    type: "entrata" | "spesa";
    color: string;
    icon: CategoryIconName;
};

// =======================================================
