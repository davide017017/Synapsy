// ╔════════════════════════════════════════════╗
// ║      useCategories: Solo GET (Lista)      ║
// ╚════════════════════════════════════════════╝

import { useEffect, useState } from "react";
import { Category } from "@/types/types/category";
import { getAllCategories } from "@/lib/api/categoriesApi";

// ==============================
// Hook: Carica lista categorie
// ==============================
export function useCategories(token?: string) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Token mancante");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        getAllCategories(token)
            .then(setCategories)
            .catch((err) => setError(err.message || "Errore"))
            .finally(() => setLoading(false));
    }, [token]);

    return { categories, loading, error };
}
