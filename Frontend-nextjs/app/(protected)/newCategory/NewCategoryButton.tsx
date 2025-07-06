"use client";

// =========================================
// NewCategoryButton.tsx
// Bottone globale per creare categoria
// =========================================

import { Plus } from "lucide-react";
import { useCategories } from "@/context/contexts/CategoriesContext";

export default function NewCategoryButton() {
    const { openModal } = useCategories();

    return (
        <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow transition hover:bg-primary/90"
            onClick={() => openModal()}
        >
            <Plus size={18} /> Nuova categoria
        </button>
    );
}
