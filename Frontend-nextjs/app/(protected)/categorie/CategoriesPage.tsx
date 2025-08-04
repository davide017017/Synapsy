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
            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-6 shadow-md overflow-hidden animate-fade-in">
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <LayoutGrid
                        className="w-[180px] h-[180px] text-[hsl(var(--c-secondary))] opacity-5 "
                        style={{ filter: "blur(2px)" }}
                    />
                </div>

                {/* -------- Titolo e descrizione -------- */}
                <div className="relative z-10 text-center max-w-xl mx-auto space-y-2">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold flex justify-center items-center gap-3 text-[hsl(var(--c-primary-dark))] drop-shadow-sm">
                        <LayoutGrid className="w-7 h-7 text-[hsl(var(--c-primary))]" />
                        <span>Categorie</span>
                    </h1>
                    <p className="text-sm color:--c-text">Gestisci in modo ordinato le categorie di entrate e spese.</p>
                </div>

                {/* -------- Pulsante -------- */}
                <div className="relative z-10 mt-4 flex justify-center">
                    <NewCategoryButton />
                </div>
            </div>

            {/* ----------- Lista categorie fuori dallo sfondo ----------- */}
            <div className="relative z-10">
                <CategoriesList />
            </div>
        </div>
    );
}

