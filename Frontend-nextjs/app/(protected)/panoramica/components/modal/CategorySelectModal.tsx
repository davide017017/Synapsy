"use client";
import { useEffect, useState } from "react";
import { Category } from "@/types/types/category";

type Props = {
    open: boolean;
    onClose: () => void;
    categories: Category[]; // prop per fallback immediato
    selectedType: "entrata" | "spesa";
    onSelect: (cat: Category) => void;
    token?: string;
};

export default function CategorySelectModal({
    open,
    onClose,
    categories: initialCategories,
    selectedType,
    onSelect,
    token,
}: Props) {
    const [tab, setTab] = useState<"entrata" | "spesa">(selectedType);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [loading, setLoading] = useState(false);

    // Fetch categorie aggiornate ogni volta che la modale si apre
    useEffect(() => {
        if (!open || !token) return;
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/categories`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Errore fetch categorie");
                return res.json();
            })
            .then((data) => setCategories(Array.isArray(data) ? data : Object.values(data)))
            .catch(() => setCategories(initialCategories))
            .finally(() => setLoading(false));
        // eslint-disable-next-line
    }, [open, token]);

    if (!open) return null;

    const filtered = categories.filter((c) => c.type === tab);

    function handleOverlayClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={handleOverlayClick}>
            <div
                className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl w-full max-w-sm shadow-xl relative flex flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Tab */}
                <div className="flex mb-2 border-b gap-2">
                    <button
                        className={`flex-1 px-3 py-2 font-semibold rounded-t-lg ${
                            tab === "entrata" ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300"
                        }`}
                        onClick={() => setTab("entrata")}
                    >
                        Entrate
                    </button>
                    <button
                        className={`flex-1 px-3 py-2 font-semibold rounded-t-lg ${
                            tab === "spesa" ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300"
                        }`}
                        onClick={() => setTab("spesa")}
                    >
                        Spese
                    </button>
                </div>

                {/* Pulsante "Crea categoria" */}
                <button
                    className="w-full mb-2 py-2 rounded border border-dashed border-primary text-primary font-semibold hover:bg-primary/10 transition"
                    onClick={() => alert("Funzione in sviluppo!")}
                >
                    + Crea categoria
                </button>

                {/* Lista categorie */}
                <ul className="divide-y divide-gray-200 dark:divide-gray-800 max-h-72 overflow-y-auto">
                    {loading && <li className="py-4 text-center text-gray-400">Caricamento…</li>}
                    {!loading && filtered.length === 0 && (
                        <li className="py-4 text-center text-gray-400">Nessuna categoria trovata.</li>
                    )}
                    {!loading &&
                        filtered.map((cat) => (
                            <li
                                key={cat.id}
                                className="py-2 px-3 cursor-pointer hover:bg-primary/10 rounded transition flex items-center"
                                onClick={() => {
                                    onSelect(cat);
                                    onClose();
                                }}
                            >
                                <span className="flex-1">{cat.name}</span>
                                <span className="text-xs text-gray-400">{cat.type}</span>
                            </li>
                        ))}
                </ul>

                <button
                    className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={onClose}
                    aria-label="Chiudi"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
