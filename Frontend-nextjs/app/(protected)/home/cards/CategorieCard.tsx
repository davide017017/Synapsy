// app/(protected)/home/cards/CategorieCard.tsx
// ======================================================================
// CategorieCard: griglia icone con # colonne controllabile (Grid + Tailwind)
// ======================================================================

"use client";

import { ArrowRight } from "lucide-react";
import { FiTag } from "react-icons/fi";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useCategories } from "@/context/CategoriesContext";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer";
import { getIconComponent } from "@/utils/categoryOptions";
import type { Category } from "@/types/models/category";
import { ReactNode } from "react";

// ======================
// Helper: icona singola
// ======================
function CategoryPill({ cat }: { cat: Category }) {
    const Icon = getIconComponent(cat.icon);
    return (
        <span
            title={cat.name}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full shadow border border-white m-1 transition-transform hover:scale-110"
            style={{ background: cat.color }}
        >
            <Icon size={20} color="#fff" />
        </span>
    );
}

// ======================
// Grid riusabile (# colonne)
//  - cols accetta solo valori whitelisted (evita purge Tailwind)
// ======================
function CategoryIconGrid({
    items,
    cols,
    empty = "-",
}: {
    items: Category[];
    cols: 3 | 4 | 5 | 6; // ← scegli tu
    empty?: ReactNode;
}) {
    const COLS_CLASS: Record<typeof cols, string> = {
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
    };
    return (
        <div className={`grid ${COLS_CLASS[cols]} gap-2 justify-items-center`}>
            {items.length ? (
                items.map((c) => <CategoryPill key={c.id} cat={c} />)
            ) : (
                <span className="text-zinc-400">{empty}</span>
            )}
        </div>
    );
}

// ===============================
// Componente principale
// ===============================
export default function CategorieCard() {
    useRenderTimer("CategorieCard");
    const { categories, loading, error } = useCategories();

    // ── Loading ────────────────────────────────────────
    if (loading) {
        return <LoadingSpinnerCard icon={<FiTag size={20} />} title="Categorie" message="Caricamento categorie..." />;
    }

    // ── Errore ─────────────────────────────────────────
    if (error) {
        return (
            <DashboardCard
                icon={<FiTag size={20} />}
                title="Categorie"
                value="!"
                href="/categorie"
                footer={
                    <span className="group inline-flex items-center gap-1 text-primary font-medium">
                        Apri per risolvere
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                }
            >
                <span className="text-xs text-red-400">{error}</span>
            </DashboardCard>
        );
    }

    // ── Split per tipo ─────────────────────────────────
    const entrate = categories.filter((c) => c.type === "entrata");
    const spese = categories.filter((c) => c.type === "spesa");

    // ── Render ─────────────────────────────────────────
    return (
        <DashboardCard
            icon={<FiTag size={20} />}
            title="Categorie"
            value={categories.length}
            href="/categorie"
            footer={
                <span className="group inline-flex items-center gap-1 text-primary font-medium">
                    {categories.length} totali • clicca per modificare
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            }
        >
            <div className="flex justify-between gap-4 mt-1">
                {/* Colonna Entrate */}
                <div className="flex-1 text-center">
                    <div className="text-xs font-semibold mb-1 flex items-center justify-center gap-1">
                        Entrate{" "}
                        <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 ml-1">
                            {entrate.length}
                        </span>
                    </div>
                    <CategoryIconGrid items={entrate} cols={5} />
                </div>

                {/* Colonna Spese */}
                <div className="flex-1 text-center">
                    <div className="text-xs font-semibold mb-1 flex items-center justify-center gap-1">
                        Spese{" "}
                        <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 ml-1">
                            {spese.length}
                        </span>
                    </div>
                    <CategoryIconGrid items={spese} cols={5} />
                </div>
            </div>
        </DashboardCard>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Card categorie con griglia controllabile: il # per riga si decide via
// prop `cols` nel componente CategoryIconGrid (Grid + grid-cols-* Tailwind).
// Usa una whitelist di classi per evitare problemi col purge di Tailwind.
// ----------------------------------------------------------------------
