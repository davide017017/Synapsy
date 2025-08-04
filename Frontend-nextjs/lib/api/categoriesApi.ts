// ╔══════════════════════════════════════════════════════╗
// ║               API: CRUD Categorie                   ║
// ║   + Move entrate/spese/ricorrenze su altra categoria║
// ╚══════════════════════════════════════════════════════╝

import { Category, CategoryBase } from "@/types/models/category";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Fetch: Lista categorie
// ==============================
export async function getAllCategories(token: string): Promise<Category[]> {
    const res = await fetch(`${API_URL}/v1/categories`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("Errore nel caricamento categorie");
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
}

// ==============================
// Create: Nuova categoria
// ==============================
export async function createCategory(token: string, payload: CategoryBase): Promise<Category> {
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
export async function updateCategory(token: string, id: number, data: CategoryBase): Promise<Category> {
    const res = await fetch(`${API_URL}/v1/categories/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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

// ==============================
// Move: Sposta tutte le ENTRATE a un'altra categoria
// ==============================
export async function moveEntrateToCategory(token: string, oldCategoryId: number, newCategoryId: number) {
    const res = await fetch(`${API_URL}/v1/entrate/move-category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldCategoryId, newCategoryId }),
    });
    if (!res.ok) throw new Error("Errore nello spostamento entrate");
    return true;
}

// ==============================
// Move: Sposta tutte le SPESE a un'altra categoria
// ==============================
export async function moveSpeseToCategory(token: string, oldCategoryId: number, newCategoryId: number) {
    const res = await fetch(`${API_URL}/v1/spese/move-category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldCategoryId, newCategoryId }),
    });
    if (!res.ok) throw new Error("Errore nello spostamento spese");
    return true;
}

// ==============================
// Move: Sposta tutte le RICORRENZE a un'altra categoria
// ==============================
export async function moveRecurringToCategory(token: string, oldCategoryId: number, newCategoryId: number) {
    const res = await fetch(`${API_URL}/v1/recurring-operations/move-category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldCategoryId, newCategoryId }),
    });
    if (!res.ok) throw new Error("Errore nello spostamento ricorrenze");
    return true;
}

// ===========================================
// Sposta TUTTO: Entrate, Spese, Ricorrenze
// ===========================================

/**
 * Sposta tutte le Entrate, Spese e Ricorrenze dalla categoria oldCategoryId a newCategoryId.
 * Lancia eccezione se almeno una delle tre chiamate fallisce.
 */
export async function moveAllToCategory(token: string, oldCategoryId: number, newCategoryId: number) {
    await Promise.all([
        moveEntrateToCategory(token, oldCategoryId, newCategoryId),
        moveSpeseToCategory(token, oldCategoryId, newCategoryId),
        moveRecurringToCategory(token, oldCategoryId, newCategoryId),
    ]);
    // Se almeno una fallisce, viene lanciata un'eccezione
}

// ════════════════════════════════════════════════════════

