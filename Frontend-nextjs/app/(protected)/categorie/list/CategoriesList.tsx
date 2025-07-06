"use client";

// =========================================
// CategoriesList.tsx — Divisa per Entrate/Spese
// =========================================

import { Pencil, Trash2 } from "lucide-react";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { useState } from "react";
import DeleteCategoryModal from "../deleteModal/DeleteCategoryModal";
import { Category } from "@/types";
import CardCategories from "./cardCategories/CardCategories";

export default function CategoriesList() {
    const { categories, loading, error, openModal, moveAndDelete, remove, refresh } = useCategories();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    // Dividi per tipo
    const entrate = categories.filter((c) => c.type === "entrata");
    const spese = categories.filter((c) => c.type === "spesa");

    // Ordina alfabeticamente
    entrate.sort((a, b) => a.name.localeCompare(b.name));
    spese.sort((a, b) => a.name.localeCompare(b.name));

    // ===== Handler eliminazione categoria =====
    async function handleDeleteCategory(
        category: Category | null,
        mode: "deleteAll" | "move",
        targetCategoryId?: number
    ) {
        if (!category) return;
        if (mode === "move" && targetCategoryId) {
            // Sposta tutte le transazioni/ricorrenze e poi elimina la categoria
            await moveAndDelete(category.id, targetCategoryId, () => {
                refresh();
            });
        } else if (mode === "deleteAll") {
            // Elimina direttamente (da usare solo se il backend elimina in cascata tutte le transazioni/ricorrenze)
            await remove(category.id, () => {
                refresh();
            });
        }
    }

    if (loading) return <div className="text-center p-4">Caricamento categorie...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <>
            <div className="mb-8">
                <CardCategories
                    categories={entrate}
                    onEdit={openModal}
                    onDelete={setCategoryToDelete}
                    typeLabel="Entrate"
                />
            </div>
            <div>
                <CardCategories
                    categories={spese}
                    onEdit={openModal}
                    onDelete={setCategoryToDelete}
                    typeLabel="Spese"
                />
            </div>
            {/* ===== Modale eliminazione ===== */}
            <DeleteCategoryModal
                category={categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                categories={categories}
            />
        </>
    );
}
