"use client";

// =======================================================
// CategoriesPage.tsx — Sfondo solo su header + pulsante
// =======================================================

import CategoriesList from "./list/CategoriesList";
import NewCategoryButton from "../newCategory/NewCategoryButton";
import { LayoutGrid } from "lucide-react";

export default function CategoriesPage() {
    return (
        <div className="space-y-2">
            {/* ----------- Blocco superiore con sfondo ----------- */}

            <div
                className="
        relative
        rounded-2xl
        border border-primary/20
        bg-black/55
        backdrop-blur-xl
        p-3 md:p-5
        shadow-[0_18px_55px_rgba(0,0,0,0.28)]
        overflow-hidden
        animate-fade-in
    "
            >
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <LayoutGrid
                        className="
                w-[140px] h-[140px]
                md:w-[180px] md:h-[180px]
                text-[hsl(var(--c-secondary))]
                opacity-5
            "
                        style={{ filter: "blur(2px)" }}
                    />
                </div>

                <div className="relative z-10 space-y-2">
                    {/* ───────── Header row ───────── */}
                    <div className="flex items-center justify-between md:justify-center md:flex-col md:gap-2">
                        <h1
                            className="
                    flex items-center gap-2
                    font-mono
                    text-lg md:text-2xl
                    font-extrabold
                    uppercase
                    tracking-[0.14em]
                    text-primary
                    drop-shadow-[0_0_14px_hsl(var(--c-primary)/0.35)]
                "
                        >
                            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                            <span>Categorie</span>
                        </h1>

                        {/* Bottone: inline su mobile, sotto su desktop */}
                        <div className="md:mt-2">
                            <NewCategoryButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* ----------- Lista categorie fuori dallo sfondo ----------- */}
            <div className="relative z-10">
                <CategoriesList />
            </div>
        </div>
    );
}
