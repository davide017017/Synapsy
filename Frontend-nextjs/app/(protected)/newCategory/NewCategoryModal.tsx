"use client";

// =========================================
// NewCategoryModal.tsx
// Modale creazione/modifica categoria
// =========================================

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Category, CategoryBase } from "@/types"; // Adatta path se serve

type Props = {
    open: boolean;
    onClose: () => void;
    categoryToEdit?: Category | null;
    onSave: (data: CategoryBase) => void;
};

export default function NewCategoryModal({ open, onClose, categoryToEdit, onSave }: Props) {
    const [name, setName] = useState("");
    const [type, setType] = useState<"entrata" | "spesa">("entrata");

    // Riempie form in caso di modifica
    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name);
            setType(categoryToEdit.type);
        } else {
            setName("");
            setType("entrata");
        }
    }, [categoryToEdit, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, type });
    };

    return (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 min-w-[320px] shadow-2xl relative">
                {/* --- Chiudi --- */}
                <button
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    onClick={onClose}
                    title="Chiudi"
                >
                    <X size={22} />
                </button>
                <h2 className="text-lg font-bold mb-3">{categoryToEdit ? "Modifica categoria" : "Nuova categoria"}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input
                            className="mt-1 block w-full rounded-lg border px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tipo</label>
                        <select
                            className="mt-1 block w-full rounded-lg border px-3 py-2"
                            value={type}
                            onChange={(e) => setType(e.target.value as "entrata" | "spesa")}
                        >
                            <option value="entrata">Entrata</option>
                            <option value="spesa">Spesa</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white rounded-xl py-2 font-semibold mt-2">
                        {categoryToEdit ? "Salva modifiche" : "Crea categoria"}
                    </button>
                </form>
            </div>
        </div>
    );
}
