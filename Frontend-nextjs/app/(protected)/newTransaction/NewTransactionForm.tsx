"use client";

/* ╔══════════════════════════════════════════════════════╗
 * ║   NewTransactionForm — Form creazione/modifica Tx   ║
 * ╚══════════════════════════════════════════════════════╝ */

import { useState, useMemo, useEffect } from "react";
import { Transaction, TransactionBase } from "@/types";
import type { NewTransactionFormProps } from "@/types";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";

// ===== Helper per classi dinamiche =====
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

// ===== Props tipizzate =====

// ╔═══════════════════════════════╗
// ║      COMPONENTE PRINCIPALE    ║
// ╚═══════════════════════════════╝
export default function NewTransactionForm({ onSave, transaction, disabled, onChangeForm, onCancel }: NewTransactionFormProps) {
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

    // ----- Context categorie -----
    const { categories, loading: loadingCategories } = useCategories();

    // ----- Inizializza in edit -----
    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date.split("T")[0],
                category_id: transaction.category_id,
                notes: transaction.notes || "",
                type: transaction.type,
            });
        }
    }, [transaction]);

    // ----- Comunica dati aggiornati -----
    useEffect(() => {
        onChangeForm && onChangeForm(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    // ----- Filtra categorie per tipo -----
    const filteredCategories = useMemo(
        () => categories.filter((cat) => cat.type === formData.type),
        [categories, formData.type]
    );

    // ======= Submit + Validazione =======
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
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    // ╔═══════════════════════════════╗
    // ║          RENDER FORM          ║
    // ╚═══════════════════════════════╝
    return (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* ===== Tipo transazione ===== */}
            <div>
                <label htmlFor="transaction-type" className="block text-sm font-medium mb-1">
                    Tipo
                </label>
                <select
                    id="transaction-type"
                    name="type"
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            type: e.target.value as "entrata" | "spesa",
                            category_id: 0,
                        })
                    }
                    className="w-full px-3 py-2 rounded-xl border bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    disabled={!!transaction}
                >
                    <option value="entrata">Entrata</option>
                    <option value="spesa">Spesa</option>
                </select>
            </div>
            {/* ===== Categoria dinamica ===== */}
            <div>
                <label htmlFor="transaction-category" className="block text-sm font-medium mb-1">
                    Categoria
                </label>
                <select
                    id="transaction-category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className={cn(
                        "w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-primary focus:outline-none",
                        errors.category_id ? "border-danger" : "border-border",
                        "bg-bg text-text"
                    )}
                    disabled={loadingCategories || disabled}
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
            </div>
            {/* ===== Descrizione ===== */}
            <div>
                <label htmlFor="transaction-description" className="block text-sm font-medium mb-1">
                    Descrizione
                </label>
                <Input
                    id="transaction-description"
                    name="description"
                    type="text"
                    placeholder="Descrizione"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={cn(errors.description ? "border-danger" : "")}
                />
                {errors.description && <p className="text-danger text-xs -mt-2">{errors.description}</p>}
            </div>
            {/* ===== Importo ===== */}
            <div>
                <label htmlFor="transaction-amount" className="block text-sm font-medium mb-1">
                    Importo
                </label>
                <Input
                    id="transaction-amount"
                    name="amount"
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
            </div>
            {/* ===== Data ===== */}
            <div>
                <label htmlFor="transaction-date" className="block text-sm font-medium mb-1">
                    Data
                </label>
                <Input
                    id="transaction-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
            </div>
            {/* ===== Note ===== */}
            <div>
                <label htmlFor="transaction-notes" className="block text-sm font-medium mb-1">
                    Note (opzionale)
                </label>
                <Textarea
                    id="transaction-notes"
                    name="notes"
                    placeholder="Note (opzionale)"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </div>
            {/* ===== Azioni ===== */}
            <div className="flex gap-2 w-full mt-6">
                <button
                    type="button"
                    className="w-1/2 bg-bg-elevate text-text border border-bg-soft rounded-xl py-2 font-semibold shadow focus:ring-2 focus:ring-primary/40 transition"
                    onClick={onCancel}
                    disabled={loading || disabled}
                >
                    Annulla
                </button>
                <button
                    type="submit"
                    className="w-1/2 bg-primary text-white rounded-xl py-2 font-semibold shadow focus:ring-2 focus:ring-primary/40 transition"
                    disabled={loading || disabled}
                >
                    {loading ? "Salvataggio..." : transaction ? "Salva modifiche" : "Crea transazione"}
                </button>
            </div>
        </form>
    );
}
