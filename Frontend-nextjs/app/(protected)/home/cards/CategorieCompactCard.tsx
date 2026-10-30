// app/(protected)/home/cards/CategorieCompactCard.tsx
// ======================================================================
// Card categorie compatta (Home mobile): header su una riga + icone in
// una sola riga a scorrimento orizzontale. Tap su un'icona → modifica.
// ======================================================================

"use client";

import Link from "next/link";
import { FiTag } from "react-icons/fi";
import { useCategories } from "@/context/CategoriesContext";
import { getIconComponent } from "@/utils/categoryOptions";
import type { Category } from "@/types/models/category";
import { HOME_CARD, HOME_SERIF, HOME_TITLE } from "../homeStyles";

// ======================
// Helper: icona cliccabile
// ======================
function CategoryIcon({ cat, onEdit }: { cat: Category; onEdit: (cat: Category) => void }) {
    const Icon = getIconComponent(cat.icon);
    return (
        <button
            type="button"
            title={cat.name}
            aria-label={`Modifica ${cat.name}`}
            onClick={() => onEdit(cat)}
            className="shrink-0 inline-flex items-center justify-center w-[26px] h-[26px] rounded-full shadow border border-white active:scale-95 transition-transform"
            style={{ background: cat.color }}
        >
            <Icon size={14} color="#fff" />
        </button>
    );
}

// ===============================
// Componente principale
// ===============================
export default function CategorieCompactCard() {
    const { categories, loading, error, openModal } = useCategories();

    const entrate = categories.filter((c) => c.type === "entrata");
    const spese = categories.filter((c) => c.type === "spesa");

    return (
        <div className={`${HOME_CARD} flex flex-col gap-2`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/categorie" className={`flex items-center gap-1.5 ${HOME_TITLE}`}>
                    <FiTag size={14} />
                    Categorie
                    <span className={`${HOME_SERIF} text-[hsl(var(--c-text))]`}>{loading ? "—" : categories.length}</span>
                </Link>
                <div className="flex gap-1">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700">
                        {entrate.length}
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700">
                        {spese.length}
                    </span>
                </div>
            </div>

            {/* Icone: entrate | spese */}
            {error ? (
                <span className="text-xs text-red-400">{error}</span>
            ) : loading ? (
                <span className="text-xs text-gray-400">Caricamento categorie...</span>
            ) : (
                <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {entrate.map((c) => (
                        <CategoryIcon key={c.id} cat={c} onEdit={openModal} />
                    ))}
                    {entrate.length > 0 && spese.length > 0 && (
                        <span className="shrink-0 w-px h-5 mx-1 bg-gray-300 dark:bg-zinc-600" aria-hidden />
                    )}
                    {spese.map((c) => (
                        <CategoryIcon key={c.id} cat={c} onEdit={openModal} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Versione compatta di CategorieCard per la Home mobile (≤ ~80px di
// altezza). Titolo + totale, pill entrate/spese, icone 26px su una riga
// scorrevole (scrollbar nascosta), entrate e spese separate da una linea
// verticale. Tap su un'icona apre la modale di modifica (openModal(cat)).
// ----------------------------------------------------------------------
