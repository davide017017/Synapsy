// =======================================================
// category.ts
// Tipi per le categorie delle transazioni
// =======================================================

/**
 * Categoria transazione
 */
export type Category = {
    id: number;
    name: string;
    type: "entrata" | "spesa";
    color: string;
    icon: string;
};

/**
 * Dati base categoria (usati per create/update)
 */
export type CategoryBase = {
    name: string;
    type: "entrata" | "spesa";
    color: string;
    icon: string;
};

// =======================================================
