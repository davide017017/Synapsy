// ╔══════════════════════════════════════════════════════╗
// ║               API: CRUD Categorie                   ║
// ╚══════════════════════════════════════════════════════╝

import { Category } from "@/types/types/category";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Fetch: Lista categorie
// ==============================
export async function fetchCategories(token: string): Promise<Category[]> {
    const res = await fetch(`${API_URL}/v1/categories`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("Errore nel caricamento categorie");
    const data = await res.json();
    // backend può restituire { data: [...] } oppure direttamente [...]
    return Array.isArray(data) ? data : data.data || [];
}

// ==============================
// Create: Nuova categoria
// ==============================
export async function createCategory(token: string, payload: Omit<Category, "id">): Promise<Category> {
    const res = await fetch(`${API_URL}/v1/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Errore creazione categoria");
    return await res.json();
}

// ==============================
// Update: Modifica categoria
// ==============================
export async function updateCategory(token: string, category: Category): Promise<Category> {
    const res = await fetch(`${API_URL}/v1/categories/${category.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Errore modifica categoria");
    return await res.json();
}

// ==============================
// Delete: Elimina categoria
// ==============================
export async function deleteCategory(token: string, categoryId: number): Promise<boolean> {
    const res = await fetch(`${API_URL}/v1/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Errore eliminazione categoria");
    return true;
}
