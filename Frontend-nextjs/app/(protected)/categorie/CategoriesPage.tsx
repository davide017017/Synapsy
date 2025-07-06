"use client";

import CategoriesList from "./list/CategoriesList";
import NewCategoryButton from "../newCategory/NewCategoryButton";

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">📂 Categorie</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Qui potrai creare, modificare e cancellare le categorie delle transazioni.
            </p>
            <NewCategoryButton />
            <CategoriesList />
        </div>
    );
}
