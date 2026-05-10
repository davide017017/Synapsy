"use client";

// ===========================================================
// CategoriesList.tsx — Visualizza categorie divise per tipo
// ===========================================================

import { useCategories } from "@/context/CategoriesContext";
import { useTransactions } from "@/context/TransactionsContext";
import { useState, useMemo } from "react";
import DeleteCategoryModal from "../deleteModal/DeleteCategoryModal";
import { Category } from "@/types";
import CardCategories from "./cardCategories/CardCategories";
import CategoryTransactionsModal from "./cardCategories/CategoryTransactionsModal";
import CategoriesListSkeleton from "./skeleton/CategoriesListSkeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

// ============================
// Componente principale
// ============================
export default function CategoriesList() {
    const { categories, loading, error, openModal, moveAndDelete, remove, refresh } = useCategories();
    const { transactions } = useTransactions();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [categoryForModal, setCategoryForModal] = useState<Category | null>(null);

    const txCountByCategory = useMemo(
        () =>
            transactions.reduce(
                (acc, tx) => {
                    const id = tx.category_id ?? tx.category?.id;
                    if (id) acc[id] = (acc[id] || 0) + 1;
                    return acc;
                },
                {} as Record<number, number>,
            ),
        [transactions],
    );

    const entrate = categories.filter((c) => c.type === "entrata").sort((a, b) => a.name.localeCompare(b.name));
    const spese = categories.filter((c) => c.type === "spesa").sort((a, b) => a.name.localeCompare(b.name));

    const handleDeleteCategory = async (
        category: Category | null,
        mode: "deleteAll" | "move",
        targetCategoryId?: number,
    ) => {
        if (!category) return;
        if (mode === "move" && targetCategoryId) {
            await moveAndDelete(category.id, targetCategoryId, () => refresh());
        } else if (mode === "deleteAll") {
            await remove(category.id);
            refresh();
        }
    };

    if (loading)
        return (
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
        <div className="w-full px-0 md:px-2 font-mono">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 relative">
                {" "}
                {/* Linea divisoria verticale */}
                <div
                    className="
                      hidden xl:block
                      absolute left-1/2 top-2 bottom-2
                      w-px
                      bg-primary/15
                      shadow-[0_0_18px_hsl(var(--c-primary)/0.18)]
                  "
                />{" "}
                {/* ================== Entrate ================== */}
                <section>
                    <h2
                        className="
                          mb-3
                          flex items-center justify-center gap-2
                          font-mono
                          text-sm
                          font-bold
                          uppercase
                          tracking-[0.14em]
                          text-[hsl(var(--c-success))]
                          drop-shadow-[0_0_12px_hsl(var(--c-success)/0.25)]
                      "
                    >
                        <ArrowUp size={18} className="drop-shadow-[0_0_10px_hsl(var(--c-success)/0.30)]" />
                        Entrate
                    </h2>
                    <CardCategories
                        categories={entrate}
                        onEdit={openModal}
                        onDelete={setCategoryToDelete}
                        txCountByCategory={txCountByCategory}
                        onViewTransactions={setCategoryForModal}
                    />
                </section>
                {/* ================== Spese ================== */}
                <section>
                    <h2
                        className="
                          mb-3
                          flex items-center justify-center gap-2
                          font-mono
                          text-sm
                          font-bold
                          uppercase
                          tracking-[0.14em]
                          text-[hsl(var(--c-danger))]
                          drop-shadow-[0_0_12px_hsl(var(--c-danger)/0.25)]
                      "
                    >
                        <ArrowDown size={18} className="drop-shadow-[0_0_10px_hsl(var(--c-danger)/0.30)]" />
                        Spese
                    </h2>
                    <CardCategories
                        categories={spese}
                        onEdit={openModal}
                        onDelete={setCategoryToDelete}
                        txCountByCategory={txCountByCategory}
                        onViewTransactions={setCategoryForModal}
                    />
                </section>
            </div>

            {/* Modale consulto rapido transazioni */}
            <CategoryTransactionsModal cat={categoryForModal} onClose={() => setCategoryForModal(null)} />

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
