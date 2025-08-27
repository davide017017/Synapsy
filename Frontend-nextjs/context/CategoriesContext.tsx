"use client";

/* ╔═════════════════════════════════════════════════════════════╗
 * ║ CategoriesContext — Categorie: CRUD + Modale + Undo        ║
 * ║ Cache di modulo + coalescing delle fetch                   ║
 * ╚═════════════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import NewCategoryModal from "@/app/(protected)/newCategory/NewCategoryModal";
import type { Category, CategoryBase } from "@/types";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    moveAllToCategory,
} from "@/lib/api/categoriesApi";

/* ────────────────────────────────────────────────────────────────
 * Cache & promise a livello di modulo
 * - Persistono tra mount/unmount (SSR, StrictMode, HMR)
 * - Condividono la stessa richiesta in corso tra più consumer
 * - `refresh()` invalida e forza un refetch
 * ──────────────────────────────────────────────────────────────── */
let categoriesCache: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;
let categoriesToken: string | undefined;

/* ===============================================================
 * Tipi del context
 * =============================================================== */
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

/* ===============================================================
 * Context base
 * =============================================================== */
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

/* ===============================================================
 * Provider
 * =============================================================== */
export function CategoriesProvider({ children }: { children: ReactNode }) {
    // Stato base
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Stato modale
    const [isOpen, setIsOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    // (facoltativo) Undo: tieni solo il setter per evitare warning "unused state"
    const [, setLastDeleted] = useState<Category | null>(null);

    // Auth
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    /* =============================================================
     * Fetch categorie (cache + coalescing)
     * ============================================================= */
    const loadCategories = useCallback(
        async (force = false) => {
            // Utente non loggato → reset locale + cache pulita
            if (!token) {
                setCategories([]);
                categoriesCache = null;
                categoriesPromise = null;
                categoriesToken = undefined;
                setLoading(false);
                return;
            }

            // Cambio utente → invalida cache
            if (categoriesToken !== token) {
                categoriesCache = null;
                categoriesPromise = null;
                categoriesToken = token;
            }

            // Usa cache se disponibile e non forzato
            if (!force && categoriesCache) {
                setCategories(categoriesCache);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const promise = categoriesPromise ?? getAllCategories(token);
                categoriesPromise = promise;

                const data = await promise;
                categoriesCache = data;
                setCategories(data);
            } catch (e: any) {
                const msg = e?.message ?? "Errore caricamento categorie";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
                categoriesPromise = null;
            }
        },
        [token]
    );

    // Bootstrap iniziale (o quando cambia token)
    useEffect(() => {
        if (token) void loadCategories();
    }, [token, loadCategories]);

    // Invalida cache e forza il refetch
    const refresh = useCallback(() => {
        categoriesCache = null;
        categoriesPromise = null;
        void loadCategories(true);
    }, [loadCategories]);

    /* =============================================================
     * CRUD (dopo ogni mutazione → refresh)
     * ============================================================= */
    const create = async (data: CategoryBase, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await createCategory(token, data);
            toast.success("Categoria creata!");
            refresh();
            onSuccess?.();
            closeModal();
        } catch (e: any) {
            toast.error(e?.message ?? "Errore creazione categoria");
        }
    };

    const update = async (id: number, data: CategoryBase, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await updateCategory(token, id, data);
            toast.success("Categoria aggiornata!");
            refresh();
            onSuccess?.();
            closeModal();
        } catch (e: any) {
            toast.error(e?.message ?? "Errore aggiornamento categoria");
        }
    };

    const remove = async (id: number) => {
        if (!token) return;
        try {
            const cat = categories.find((c) => c.id === id);
            if (!cat) return;

            await deleteCategory(token, id);
            setLastDeleted(cat);
            refresh();

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
                        if (!token) return;
                        setLoading(true);
                        try {
                            const { id: _omit, ...catBase } = cat;
                            await createCategory(token, catBase);
                            refresh();
                            toast.success("Eliminazione annullata!");
                        } catch {
                            toast.error("Errore durante l'annullamento.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            });
        } catch (e: any) {
            toast.error(e?.message ?? "Errore eliminazione categoria");
        }
    };

    const moveAndDelete = async (categoryId: number, targetCategoryId: number, onSuccess?: () => void) => {
        if (!token) return;
        try {
            await moveAllToCategory(token, categoryId, targetCategoryId);
            await deleteCategory(token, categoryId);
            toast.success("Transazioni e ricorrenze spostate. Categoria eliminata!");
            refresh();
            onSuccess?.();
        } catch (e: any) {
            toast.error(e?.message ?? "Errore nello spostamento o nella cancellazione.");
        }
    };

    /* =============================================================
     * Modale create/edit
     * ============================================================= */
    const openModal = (cat?: Category | null) => {
        setCategoryToEdit(cat ?? null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setCategoryToEdit(null);
        setIsOpen(false);
    };

    /* =============================================================
     * Render provider
     * ============================================================= */
    return (
        <CategoriesContext.Provider
            value={{
                categories,
                loading,
                error,
                refresh,
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
            {/* Modale globale riutilizzabile (create/edit) */}
            <NewCategoryModal
                open={isOpen}
                onClose={closeModal}
                categoryToEdit={categoryToEdit}
                onSave={categoryToEdit ? (data) => update(categoryToEdit.id, data) : create}
            />
        </CategoriesContext.Provider>
    );
}

/* ===============================================================
 * Hook custom
 * =============================================================== */
export function useCategories() {
    const ctx = useContext(CategoriesContext);
    if (!ctx) throw new Error("useCategories deve essere usato dentro <CategoriesProvider>");
    return ctx;
}
