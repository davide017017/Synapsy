"use client";

// =========================================
// NewCategoryButton.tsx
// Bottone globale per creare una nuova categoria
// =========================================

import { PlusCircle } from "lucide-react";
import { useCategories } from "@/context/CategoriesContext";
import type { NewCategoryButtonProps } from "@/types";

export default function NewCategoryButton({ label = "Categoria", onSuccess, compact = false }: NewCategoryButtonProps) {
    const { openModal } = useCategories();

    return (
        <button
            type="button"
            className={
                compact
                    ? "flex-1 inline-flex items-center justify-center gap-1 h-[30px] px-1 rounded-lg bg-gradient-to-b from-primary to-primary-dark text-bg hover:opacity-90 tracking-[.08em] uppercase text-[9px] font-bold font-mono border border-primary/40 transition shadow-lg active:scale-95"
                    : "inline-flex items-center gap-2 px-2 py-1.5 rounded-md bg-gradient-to-b from-primary to-primary-dark text-bg hover:opacity-90 tracking-wider uppercase text-xs font-mono border border-primary/40 transition shadow-lg active:scale-95"
            }
            onClick={() => openModal()}
        >
            <PlusCircle size={compact ? 12 : 16} />
            {label}
        </button>
    );
}
