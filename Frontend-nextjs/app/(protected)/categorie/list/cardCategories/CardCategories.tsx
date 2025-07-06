"use client";

// ================================================
// CardCategories.tsx — Visualizza categorie a card
// ================================================

import { Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types";

type Props = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    typeLabel?: string; // opzionale, titolo sopra le card
};

export default function CardCategories({ categories, onEdit, onDelete, typeLabel }: Props) {
    if (!categories.length)
        return (
            <div className="text-zinc-500 text-sm my-4">
                Nessuna categoria
                {typeLabel ? ` di ${typeLabel}` : ""}
            </div>
        );

    return (
        <div>
            {typeLabel && <h2 className="text-xl font-semibold mb-3">{typeLabel}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`rounded-2xl p-4 shadow-lg border flex items-center justify-between transition ${
                            cat.type === "entrata"
                                ? "border-green-200 bg-green-50 dark:bg-green-950"
                                : "border-red-200 bg-red-50 dark:bg-red-950"
                        }`}
                    >
                        <div>
                            <div className="font-semibold text-lg">{cat.name}</div>
                            <div
                                className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    cat.type === "entrata"
                                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100"
                                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100"
                                }`}
                            >
                                {cat.type === "entrata" ? "Entrata" : "Spesa"}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                title="Modifica"
                                onClick={() => onEdit(cat)}
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500"
                                title="Elimina"
                                onClick={() => onDelete(cat)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
