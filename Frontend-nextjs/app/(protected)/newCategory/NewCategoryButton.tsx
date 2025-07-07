"use client";

// =========================================
// NewCategoryButton.tsx
// Bottone globale per creare una nuova categoria
// =========================================

import { PlusCircle } from "lucide-react";
import { useCategories } from "@/context/contexts/CategoriesContext";

// Nessuna tipizzazione extra necessaria
export default function NewCategoryButton({
    label = "Nuova Categoria",
    onSuccess,
}: {
    label?: string;
    onSuccess?: () => void;
}) {
    const { openModal } = useCategories();

    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-dark text-bg hover:opacity-90 text-sm font-medium transition shadow-lg active:scale-95"
            onClick={() => openModal()}
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
