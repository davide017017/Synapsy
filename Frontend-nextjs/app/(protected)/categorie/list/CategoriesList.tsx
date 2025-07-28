"use client";

// ===========================================================
// CategoriesList.tsx — Visualizza categorie divise per tipo
// ===========================================================

import { useCategories } from "@/context/contexts/CategoriesContext";
import { useState } from "react";
import DeleteCategoryModal from "../deleteModal/DeleteCategoryModal";
import { Category } from "@/types";
import CardCategories from "./cardCategories/CardCategories";
import CategoriesListSkeleton from "./skeleton/CategoriesListSkeleton";

// ============================
// Componente principale
// ============================
export default function CategoriesList() {
    const { categories, loading, error, openModal, moveAndDelete, remove, refresh } = useCategories();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const entrate = categories.filter((c) => c.type === "entrata").sort((a, b) => a.name.localeCompare(b.name));
    const spese = categories.filter((c) => c.type === "spesa").sort((a, b) => a.name.localeCompare(b.name));

    const handleDeleteCategory = async (
        category: Category | null,
        mode: "deleteAll" | "move",
        targetCategoryId?: number
    ) => {
        if (!category) return;
        if (mode === "move" && targetCategoryId) {
            await moveAndDelete(category.id, targetCategoryId, () => refresh());
        } else if (mode === "deleteAll") {
            await remove(category.id);
            refresh();
        }
    };

    if (loading) return (
        <div className="px-2 md:px-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="hidden xl:block" />
                <div className="space-y-2">
                    <CategoriesListSkeleton />
                </div>
            </div>
        </div>
    );
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="w-full px-2 md:px-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 relative">
                {/* Linea divisoria verticale */}
                <div className="hidden xl:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700" />

                {/* ================== Entrate ================== */}
                <section>
                    <h2 className="text-center text-lg font-bold text-green-500 uppercase mb-2">Categorie Entrata +</h2>
                    <CardCategories categories={entrate} onEdit={openModal} onDelete={setCategoryToDelete} />
                </section>

                {/* ================== Spese ================== */}
                <section>
                    <h2 className="text-center text-lg font-bold text-red-500 uppercase mb-2">Categorie Spesa -</h2>
                    <CardCategories categories={spese} onEdit={openModal} onDelete={setCategoryToDelete} />
                </section>
            </div>

            {/* Modale conferma eliminazione */}
            <DeleteCategoryModal
                category={categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                categories={categories}
                onDelete={(mode, targetCategoryId) => handleDeleteCategory(categoryToDelete, mode, targetCategoryId)}
            />
        </div>
    );
}
