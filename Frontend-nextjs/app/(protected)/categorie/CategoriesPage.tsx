"use client";

// =======================================================
// CategoriesPage.tsx — Sfondo solo su header + pulsante
// =======================================================

import CategoriesList from "./list/CategoriesList";
import NewCategoryButton from "../newCategory/NewCategoryButton";
import { LayoutGrid } from "lucide-react";

export default function CategoriesPage() {
    return (
        <div className="px-2 md:px-6 pt-6 pb-12 space-y-6">
            {/* ----------- Blocco superiore con sfondo ----------- */}

            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-4 md:p-6 shadow-md overflow-hidden animate-fade-in">
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <LayoutGrid
                        className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] text-[hsl(var(--c-secondary))] opacity-5"
                        style={{ filter: "blur(2px)" }}
                    />
                </div>

                <div className="relative z-10 space-y-2">
                    {/* ───────── Header row (mobile compatto) ───────── */}
                    <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-2">
                        <h1 className="text-lg md:text-3xl font-serif font-bold flex items-center gap-2 text-[hsl(var(--c-primary-dark))]">
                            <LayoutGrid className="w-5 h-5 md:w-7 md:h-7 text-[hsl(var(--c-primary))]" />
                            <span>Categorie</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewCategoryButton />
                        </div>
                    </div>

                    {/* ───────── Subtitle ───────── */}
                    <p className="text-xs md:text-sm text-[hsl(var(--c-text-secondary))] text-left md:text-center">
                        Gestisci in modo ordinato le categorie di entrate e spese.
                    </p>
                </div>
            </div>

            {/* ----------- Lista categorie fuori dallo sfondo ----------- */}
            <div className="relative z-10">
                <CategoriesList />
            </div>
        </div>
    );
}
