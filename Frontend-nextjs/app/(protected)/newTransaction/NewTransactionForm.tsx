"use client";
// ============================
// NewTransactionForm.tsx
// Form di inserimento nuova transazione (uniformato)
// ============================

import { useState, useMemo } from "react";
import { TransactionBase } from "@/types";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { toast } from "sonner";

// --------------------
// Utility classnames
// --------------------
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

// --------------------
// Props tipizzate
// --------------------
type Props = {
    onSave?: (data: TransactionBase) => void;
};

// ============================
// COMPONENTE PRINCIPALE
// ============================
export default function NewTransactionForm({ onSave }: Props) {
    // ----- Context categorie -----
    const { categories, loading: loadingCategories } = useCategories();

    // ----- Stato form -----
    const [formData, setFormData] = useState<TransactionBase>({
        description: "",
        amount: "" as any,
        date: new Date().toISOString().split("T")[0],
        category_id: 0,
        notes: "",
        type: "entrata",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // ----- Categorie filtrate dinamicamente per tipo -----
    const filteredCategories = useMemo(
        () => categories.filter((cat) => cat.type === formData.type),
        [categories, formData.type]
    );

    // ============================
    // Handle submit (validazione + salvataggio)
    // ============================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errs: Record<string, string> = {};

        if (!formData.description.trim()) errs.description = "La descrizione è obbligatoria";
        if (!formData.category_id) errs.category_id = "Seleziona una categoria";
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
            errs.amount = "L’importo deve essere maggiore di 0";

        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await onSave?.({
                ...formData,
                amount: Number(formData.amount),
            });
            toast.success("Transazione salvata con successo!");
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Render form
    // ============================
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* --------- Tipo transazione --------- */}
            <select
                value={formData.type}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        type: e.target.value as "entrata" | "spesa",
                        category_id: 0, // reset categoria se cambi tipo
                    })
                }
                className="w-full px-3 py-2 rounded-xl border bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
                <option value="entrata">Entrata</option>
                <option value="spesa">Spesa</option>
            </select>
            {/* --------- Categoria dinamica --------- */}
            <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                className={cn(
                    "w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-primary focus:outline-none",
                    errors.category_id ? "border-danger" : "border-border",
                    "bg-bg text-text"
                )}
                disabled={loadingCategories}
            >
                <option value={0} disabled>
                    {loadingCategories ? "Caricamento..." : "Seleziona categoria"}
                </option>
                {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            {errors.category_id && <p className="text-danger text-xs -mt-2">{errors.category_id}</p>}

            {/* --------- Descrizione --------- */}
            <Input
                type="text"
                placeholder="Descrizione"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn(errors.description ? "border-danger" : "")}
            />
            {errors.description && <p className="text-danger text-xs -mt-2">{errors.description}</p>}

            {/* --------- Importo --------- */}
            <Input
                type="number"
                step="0.01"
                placeholder="Importo"
                value={formData.amount === 0 ? "" : formData.amount}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                    })
                }
                className={cn(errors.amount ? "border-danger" : "")}
            />
            {errors.amount && <p className="text-danger text-xs -mt-2">{errors.amount}</p>}

            {/* --------- Data --------- */}
            <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            {/* --------- Note --------- */}
            <Textarea
                placeholder="Note (opzionale)"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            {/* --------- Azioni --------- */}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Salvataggio..." : "Salva"}
            </Button>
        </form>
    );
}
