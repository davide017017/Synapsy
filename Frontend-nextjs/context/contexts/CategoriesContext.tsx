"use client";

/* ╔═════════════════════════════════════════════════════════════╗
 * ║   Context globale categorie: fetch/cache + CRUD + modale   ║
 * ╚═════════════════════════════════════════════════════════════╝ */

import { createContext, useContext, useEffect, useState } from "react";
import { Category, CategoryBase } from "@/types";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    moveAllToCategory,
} from "@/lib/api/categoriesApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NewCategoryModal from "@/app/(protected)/newCategory/NewCategoryModal"; // Path da adattare se serve

type CategoriesContextType = {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refresh: () => void;

    // CRUD
    create: (data: CategoryBase, onSuccess?: () => void) => Promise<void>;
    update: (id: number, data: CategoryBase, onSuccess?: () => void) => Promise<void>;
    remove: (id: number, onSuccess?: () => void) => Promise<void>;

    // Spostamento massivo + eliminazione
    moveAndDelete: (categoryId: number, targetCategoryId: number, onSuccess?: () => void) => Promise<void>;

    // Modale globale
    openModal: (categoryToEdit?: Category | null) => void;
    closeModal: () => void;
    isOpen: boolean;
    categoryToEdit: Category | null;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Gestione modale ---
    const [isOpen, setIsOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // ===== Carica categorie =====
    const loadCategories = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCategories(token);
            setCategories(data);
        } catch (e: any) {
            setError(e.message || "Errore caricamento categorie");
            toast.error(e.message || "Errore caricamento categorie");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadCategories();
    }, [token]);

    // ===== CRUD =====

    const create = async (data: CategoryBase, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await createCategory(token, data);
            toast.success("Categoria creata!");
            await loadCategories();
            onSuccess?.();
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore creazione categoria");
        }
    };

    const update = async (id: number, data: CategoryBase, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await updateCategory(token, id, data);
            toast.success("Categoria aggiornata!");
            await loadCategories();
            onSuccess?.();
            closeModal();
        } catch (e: any) {
            toast.error(e.message || "Errore aggiornamento categoria");
        }
    };

    const remove = async (id: number, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await deleteCategory(token, id);
            toast.success("Categoria eliminata!");
            await loadCategories();
            onSuccess?.();
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione categoria");
        }
    };

    // ===== Spostamento massivo + eliminazione =====

    /**
     * Sposta tutte le transazioni/ricorrenze sulla nuova categoria,
     * poi elimina la vecchia categoria.
     */
    const moveAndDelete = async (categoryId: number, targetCategoryId: number, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await moveAllToCategory(token, categoryId, targetCategoryId);
            await deleteCategory(token, categoryId);
            toast.success("Transazioni e ricorrenze spostate. Categoria eliminata!");
            await loadCategories();
            onSuccess?.();
        } catch (e: any) {
            toast.error(e.message || "Errore nello spostamento o nella cancellazione.");
        }
    };

    // ===== Modale globale =====

    const openModal = (cat?: Category | null) => {
        setCategoryToEdit(cat || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setCategoryToEdit(null);
        setIsOpen(false);
    };

    // ===== Provider =====

    return (
        <CategoriesContext.Provider
            value={{
                categories,
                loading,
                error,
                refresh: loadCategories,
                create,
                update,
                remove,
                moveAndDelete,
                openModal,
                closeModal,
                isOpen,
                categoryToEdit,
            }}
        >
            {children}
            {/* Modale globale riusabile per create/edit */}
            <NewCategoryModal
                open={isOpen}
                onClose={closeModal}
                categoryToEdit={categoryToEdit}
                onSave={categoryToEdit ? (data) => update(categoryToEdit.id, data) : create}
            />
        </CategoriesContext.Provider>
    );
}

// Hook custom
export function useCategories() {
    const context = useContext(CategoriesContext);
    if (!context) throw new Error("useCategories deve essere usato dentro <CategoriesProvider>");
    return context;
}

/* ════════════════════════════════════════════════════════ */
