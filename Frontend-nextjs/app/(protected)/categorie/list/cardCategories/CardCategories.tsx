"use client";

// ============================
// CardCategories.tsx — Card visualizzazione categorie (tema custom property)
// ============================

import { Category } from "@/types";
import type { CardCategoriesProps, CategoryCardProps } from "@/types";
import { getIconComponent } from "@/utils/categoryOptions";
import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// ============================
// Lista cards (grid responsive)
// ============================
export default function CardCategories({ categories, onEdit, onDelete }: CardCategoriesProps) {
    return (
        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
            {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
    );
}

// ============================
// Singola card categoria
// ============================
function CategoryCard({ cat, onEdit, onDelete }: CategoryCardProps) {
    const Icon = getIconComponent(cat.icon);

    const nameRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) setShowTooltip(el.scrollWidth > el.clientWidth);
    }, [cat.name]);

    // Colore accent (bordi, glow)
    const accent = cat.color || (cat.type === "entrata" ? "#16f5c7" : "#fd518d");

    return (
        <li
            className={`
                relative rounded-2xl p-3 sm:p-4 min-h-[72px] sm:min-h-[100px]
                flex flex-col justify-between
                shadow-lg hover:shadow-2xl border-l-8 transition-all
            `}
            style={{
                borderLeftColor: accent,
                background: `hsl(var(--c-category-div-bg))`,
                color: `hsl(var(--c-category-div-text))`,
                boxShadow: `0 0 6px 0 ${accent}99, 0 4px 16px 0 #0006`,
            }}
        >
            {/* ----------------------------
               Icona grande di sfondo
            ---------------------------- */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute bottom-1 right-1 opacity-20 text-[70px] sm:text-[100px]"
                    style={{ color: accent }}
                >
                    <Icon />
                </div>
            </div>

            {/* ----------------------------
               Header row: Nome + Badge
               (stessa riga, più compatto)
            ---------------------------- */}
            <div className="flex items-center justify-between gap-2 mb-2 z-10">
                {/* Nome categoria */}
                <div
                    ref={nameRef}
                    className={`
                        font-semibold text-base sm:text-lg text-left truncate
                        max-w-[120px] sm:max-w-[170px]
                        ${showTooltip ? "cursor-help" : ""}
                    `}
                    style={{ color: "hsl(var(--c-category-div-text))" }}
                    title={showTooltip ? cat.name : ""}
                >
                    {cat.name}
                </div>

                {/* Badge tipo */}
                <span
                    className={`
                        inline-flex items-center shrink-0
                        px-2 sm:px-3 py-0.5 sm:py-1
                        rounded-full text-[11px] sm:text-xs font-semibold border
                        shadow shadow-black/40 bg-opacity-30
                    `}
                    style={{
                        backgroundColor: accent + "22",
                        color: "hsl(var(--c-category-div-text))",
                        borderColor: accent,
                    }}
                >
                    {cat.type === "entrata" ? "Entrata" : "Spesa"}
                </span>
            </div>

            {/* ----------------------------
               Bottoni azioni
            ---------------------------- */}
            <div className="flex gap-2 justify-left mt-auto z-10">
                <button
                    className="p-2 rounded-full bg-transparent hover:bg-blue-600/80 hover:text-white text-blue-500 transition"
                    onClick={() => onEdit(cat)}
                    title="Modifica"
                >
                    <Pencil size={18} />
                </button>
                <button
                    className="p-2 rounded-full bg-transparent hover:bg-red-700/80 hover:text-white text-red-500 transition"
                    onClick={() => onDelete(cat)}
                    title="Elimina"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </li>
    );
}

// ===================================================
// Questo file renderizza la griglia di cards categoria.
// Ogni card mostra nome + badge tipo sulla stessa riga
// (più compatto su mobile), icona di sfondo e azioni.
// ===================================================
