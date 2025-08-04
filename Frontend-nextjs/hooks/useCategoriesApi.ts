// ╔══════════════════════════════════════════════════════╗
// ║     useCategoriesApi: Mutazioni (CUD) Categorie     ║
// ╚══════════════════════════════════════════════════════╝

import { useState } from "react";
import { Category } from "@/types/models/category";
import { createCategory, updateCategory, deleteCategory } from "@/lib/api/categoriesApi";

type Status = "idle" | "loading" | "success" | "error";

// ==============================
// Hook: Mutazioni categorie (CUD)
// ==============================
export function useCategoriesApi(token?: string) {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);

    // ───── CREATE ─────
    async function create(newCategory: Omit<Category, "id">) {
        if (!token) return null;
        setStatus("loading");
        setError(null);
        try {
            const data = await createCategory(token, newCategory);
            setStatus("success");
            return data;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore creazione");
            return null;
        }
    }

    // ───── UPDATE ─────
    async function update(category: Category) {
        if (!token) return null;
        setStatus("loading");
        setError(null);
        try {
            const { id, ...payload } = category;
            const data = await updateCategory(token, id, payload);
            setStatus("success");
            return data;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore update");
            return null;
        }
    }

    // ───── DELETE ─────
    async function remove(category: Category) {
        if (!token) return false;
        setStatus("loading");
        setError(null);
        try {
            await deleteCategory(token, category.id);
            setStatus("success");
            return true;
        } catch (e: any) {
            setStatus("error");
            setError(e.message || "Errore delete");
            return false;
        }
    }

    // ───── Reset stato (opzionale) ─────
    function reset() {
        setStatus("idle");
        setError(null);
    }

    return { create, update, remove, status, error, reset };
}

