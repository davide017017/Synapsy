"use client";

/* ╔═════════════════════════════════════════════════════════════╗
 * ║     Context globale per gestione categorie (fetch/cache)   ║
 * ╚═════════════════════════════════════════════════════════════╝ */

import { createContext, useContext, useEffect, useState } from "react";
import { Category } from "@/types"; // Adatta al tuo tipo
import { getAllCategories } from "@/lib/api/categoriesApi";
import { useSession } from "next-auth/react";

type CategoriesContextType = {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    const token = session?.accessToken;

    const loadCategories = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCategories(token);
            setCategories(data);
        } catch (e: any) {
            setError(e.message || "Errore caricamento categorie");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadCategories();
    }, [token]);

    return (
        <CategoriesContext.Provider value={{ categories, loading, error, refresh: loadCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
}

// Hook per accesso rapido
export function useCategories() {
    const context = useContext(CategoriesContext);
    if (!context) throw new Error("useCategories deve essere usato dentro <CategoriesProvider>");
    return context;
}
