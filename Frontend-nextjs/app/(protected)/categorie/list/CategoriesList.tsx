"use client";

// ===========================================================
// CategoriesList.tsx — Visualizza categorie divise per Entrate/Spese
// ===========================================================

import { useCategories } from "@/context/contexts/CategoriesContext";
import { useState } from "react";
import DeleteCategoryModal from "../deleteModal/DeleteCategoryModal";
import { Category } from "@/types";
import CardCategories from "./cardCategories/CardCategories";

// ============================
// Componente principale
// ============================
export default function CategoriesList() {
    const { categories, loading, error, openModal, moveAndDelete, remove, refresh } = useCategories();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    // Dividi categorie per tipo
    const entrate = categories.filter((c) => c.type === "entrata");
    const spese = categories.filter((c) => c.type === "spesa");

    // Ordina alfabeticamente
    entrate.sort((a, b) => a.name.localeCompare(b.name));
    spese.sort((a, b) => a.name.localeCompare(b.name));

    // Gestione eliminazione categoria
    async function handleDeleteCategory(
        category: Category | null,
        mode: "deleteAll" | "move",
        targetCategoryId?: number
    ) {
        if (!category) return;
        if (mode === "move" && targetCategoryId) {
            await moveAndDelete(category.id, targetCategoryId, () => refresh());
        } else if (mode === "deleteAll") {
            await remove(category.id, () => refresh());
        }
    }

    // Loading/error state
    if (loading) return <div className="text-center p-4">Caricamento categorie...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="w-full px-2 md:px-6">
            <div className="flex flex-col xl:flex-row gap-8">
                {/* ================== Entrate ================== */}
                <section className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block w-1 h-6 rounded bg-green-500" />
                        <h2 className="text-xl font-bold text-green-600 dark:text-green-300 uppercase tracking-wide">
                            Categorie Entrata
                        </h2>
                    </div>
                    <div className="pl-2 lg:pl-3 border-l-4 border-green-400">
                        <CardCategories categories={entrate} onEdit={openModal} onDelete={setCategoryToDelete} />
                        {entrate.length === 0 && (
                            <div className="text-zinc-500 text-sm my-4">Nessuna categoria di entrata</div>
                        )}
                    </div>
                </section>
                {/* ================== Spese ================== */}
                <section className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block w-1 h-6 rounded bg-red-500" />
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-300 uppercase tracking-wide">
                            Categorie Spesa
                        </h2>
                    </div>
                    <div className="pl-2 lg:pl-3 border-l-4 border-red-400">
                        <CardCategories categories={spese} onEdit={openModal} onDelete={setCategoryToDelete} />
                        {spese.length === 0 && (
                            <div className="text-zinc-500 text-sm my-4">Nessuna categoria di spesa</div>
                        )}
                    </div>
                </section>
            </div>
            {/* ========== Modale eliminazione ========== */}
            <DeleteCategoryModal
                category={categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                categories={categories}
                onDelete={(mode, targetCategoryId) => handleDeleteCategory(categoryToDelete, mode, targetCategoryId)}
            />
        </div>
    );
}

// ===================== END CategoriesList =====================
