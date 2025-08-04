"use client";

/* ╔═════════════════════════════════════════════════════════════╗
 * ║    CategoriesContext — Categorie: CRUD + Modale + Undo     ║
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
import NewCategoryModal from "@/app/(protected)/newCategory/NewCategoryModal";

// ===========================================================
// Tipizzazione context
// ===========================================================
type CategoriesContextType = {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
    // CRUD
    create: (data: CategoryBase, onSuccess?: () => void) => Promise<void>;
    update: (id: number, data: CategoryBase, onSuccess?: () => void) => Promise<void>;
    remove: (id: number) => Promise<void>;
    // Spostamento massivo + eliminazione
    moveAndDelete: (categoryId: number, targetCategoryId: number, onSuccess?: () => void) => Promise<void>;
    // Modale globale
    openModal: (categoryToEdit?: Category | null) => void;
    closeModal: () => void;
    isOpen: boolean;
    categoryToEdit: Category | null;
};

// ===========================================================
// Context base
// ===========================================================
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// ===========================================================
// Provider principale
// ===========================================================
export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    // State base
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State modale
    const [isOpen, setIsOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    // Undo delete
    const [lastDeleted, setLastDeleted] = useState<Category | null>(null);

    // Auth
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // =======================================================
    // Fetch categorie da API
    // =======================================================
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

    // =======================================================
    // CRUD: Create
    // =======================================================
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

    // =======================================================
    // CRUD: Update
    // =======================================================
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

    // =======================================================
    // CRUD: Remove + Undo Delete (Sonner)
    // =======================================================
    const remove = async (id: number) => {
        if (!token) return;
        try {
            const cat = categories.find((c) => c.id === id);
            if (!cat) return;

            // Elimina la categoria
            await deleteCategory(token, id);
            setLastDeleted(cat); // Per eventuale undo
            await loadCategories();

            // Toast con undo
            toast.success("Categoria eliminata!", {
                description: (
                    <div>
                        <span className="font-semibold">{cat.name}</span> rimossa.
                        <br />
                        <span className="text-sm text-zinc-500">Puoi annullare questa operazione.</span>
                    </div>
                ),
                action: {
                    label: "Ripristina",
                    onClick: async () => {
                        if (!token || !cat) return;
                        setLoading(true);
                        try {
                            const { id, ...catBase } = cat;
                            await createCategory(token, catBase);
                            await loadCategories();
                            toast.success("Eliminazione annullata!");
                        } catch (e: any) {
                            toast.error("Errore durante l'annullamento.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            });
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione categoria");
        }
    };

    // =======================================================
    // Spostamento massivo + eliminazione categoria
    // =======================================================
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

    // =======================================================
    // Gestione modale (create/edit)
    // =======================================================
    const openModal = (cat?: Category | null) => {
        setCategoryToEdit(cat || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setCategoryToEdit(null);
        setIsOpen(false);
    };

    // =======================================================
    // Provider render
    // =======================================================
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

// ===========================================================
// Hook custom per usare il context
// ===========================================================
export function useCategories() {
    const context = useContext(CategoriesContext);
    if (!context) throw new Error("useCategories deve essere usato dentro <CategoriesProvider>");
    return context;
}
// ===========================================================

