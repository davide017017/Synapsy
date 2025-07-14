"use client";

// ===========================================================
// CardCategories.tsx — Card visualizzazione categorie
// ===========================================================

import { Category } from "@/types";
import { getIconComponent } from "@/utils/iconMap";
import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Props della lista
type CardCategoriesProps = {
    categories: Category[];
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
};

export default function CardCategories({ categories, onEdit, onDelete }: CardCategoriesProps) {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
    );
}

// ==========================
// Card singola categoria
// ==========================
type CardProps = {
    cat: Category;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
};

function CategoryCard({ cat, onEdit, onDelete }: CardProps) {
    const Icon = getIconComponent(cat.icon);

    // Tooltip su overflow nome
    const nameRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) setShowTooltip(el.scrollWidth > el.clientWidth);
    }, [cat.name]);

    // ------ COLORI DINAMICI -------
    const colorBorder = cat.color || (cat.type === "entrata" ? "#22c55e" : "#ef4444"); // fallback tailwind green/red
    const colorBg = cat.color ? `${cat.color}18` : "rgba(0,0,0,0.05)"; // leggero bg
    const colorIconBg = cat.color ? `${cat.color}2e` : "#f4f4f4";
    const colorIcon = cat.color || (cat.type === "entrata" ? "#22c55e" : "#ef4444");

    return (
        <li
            className={`
                rounded-2xl p-3 border-l-8 flex flex-col items-center justify-between
                min-h-[140px] shadow transition hover:shadow-xl group
            `}
            style={{
                borderLeft: `8px solid ${colorBorder}`,
                background: colorBg,
            }}
        >
            {/* ----------- Icona + tipo ----------- */}
            <div className="flex items-center gap-2 mb-2">
                <span
                    className="rounded-full p-2 transition-all"
                    style={{
                        background: colorIconBg,
                        color: colorIcon,
                        fontSize: 32,
                        border: `1.5px solid ${colorBorder}`,
                    }}
                >
                    <Icon size={28} />
                </span>
                <span
                    className={`
                        inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${
                            cat.type === "entrata"
                                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                        }
                    `}
                >
                    {cat.type === "entrata" ? "Entrata" : "Spesa"}
                </span>
            </div>

            {/* ----------- Nome categoria (tooltip su overflow) ----------- */}
            <div className="w-full flex justify-center mb-1">
                <div
                    ref={nameRef}
                    className="font-semibold text-lg text-center truncate max-w-[160px] cursor-help"
                    title={showTooltip ? cat.name : undefined}
                    style={{ color: colorBorder }}
                >
                    {cat.name}
                </div>
            </div>

            {/* ----------- Bottoni azione ----------- */}
            <div className="flex gap-2 justify-center mt-auto">
                <button
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                    onClick={() => onEdit(cat)}
                    title="Modifica"
                >
                    <Pencil size={18} />
                </button>
                <button
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition"
                    onClick={() => onDelete(cat)}
                    title="Elimina"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </li>
    );
}

// ===================== END CardCategories =====================
