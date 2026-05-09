"use client";

// =========================================
// NewCategoryButton.tsx
// Bottone globale per creare una nuova categoria
// =========================================

import { PlusCircle } from "lucide-react";
import { useCategories } from "@/context/CategoriesContext";
import type { NewCategoryButtonProps } from "@/types";

export default function NewCategoryButton({ label = "Categoria", onSuccess }: NewCategoryButtonProps) {
    const { openModal } = useCategories();

    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md bg-gradient-to-b from-primary to-primary-dark text-bg hover:opacity-90 tracking-wider uppercase text-xs font-mono border border-primary/40 transition shadow-lg active:scale-95"
            onClick={() => openModal()}
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
