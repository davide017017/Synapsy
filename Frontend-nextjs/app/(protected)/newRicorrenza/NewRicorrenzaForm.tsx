"use client";

// ╔═══════════════════════════════════════════════════════╗
// ║    NewRicorrenzaForm.tsx — Form Create/Edit (UX/UI)  ║
// ╚═══════════════════════════════════════════════════════╝

import { useState, useMemo, useEffect } from "react";
import { RicorrenzaBase } from "@/types/models/ricorrenza";
import type { NewRicorrenzaFormProps } from "@/types";
import { useCategories } from "@/context/CategoriesContext";
import type { Category } from "@/types/models/category";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";

// ===== Helper: formatta data per input type="date" =====
function toDateInputValue(dateString?: string) {
    if (!dateString) return new Date().toISOString().split("T")[0];
    const d = new Date(dateString);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

// ===== Tipi Props =====

// ╔═══════════════════════════════════════════════════════╗
// ║              COMPONENTE PRINCIPALE                   ║
// ╚═══════════════════════════════════════════════════════╝
export default function NewRicorrenzaForm({ onSave, onCancel, initialValues, onChangeForm }: NewRicorrenzaFormProps) {
    const { categories, loading: loadingCategories } = useCategories();

    // ==================== STATE ====================
    const [formData, setFormData] = useState<RicorrenzaBase>({
        nome: initialValues?.nome || "",
        importo: initialValues?.importo || 0,
        frequenza: initialValues?.frequenza || "monthly",
        prossima: toDateInputValue(initialValues?.prossima),
        category_id: initialValues?.category_id || 0,
        notes: initialValues?.notes || "",
        type: initialValues?.type || "entrata",
        is_active: initialValues?.is_active ?? true,
        interval: initialValues?.interval || 1,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (initialValues) {
            setFormData((prev) => ({
                ...prev,
                ...initialValues,
                prossima: toDateInputValue(initialValues.prossima),
                importo: initialValues.importo ?? 0,
                is_active: initialValues.is_active ?? true,
                interval: initialValues.interval ?? 1,
            }));
        }
    }, [initialValues]);

    useEffect(() => {
        if (onChangeForm) onChangeForm(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    // ==================== CATEGORY FILTER ====================
    const filteredCategories = useMemo(
        () => categories.filter((cat: Category) => cat.type === formData.type),
        [categories, formData.type]
    );

    // ==================== HANDLERS ====================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!formData.nome.trim()) errs.nome = "Il nome è obbligatorio";
        if (!formData.importo || isNaN(formData.importo) || Number(formData.importo) <= 0)
            errs.importo = "L’importo deve essere maggiore di 0";
        if (!formData.prossima) errs.prossima = "La data è obbligatoria";
        if (!formData.category_id) errs.category_id = "Seleziona una categoria";
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    // ╔═══════════════════════════════════════════════════════╗
    // ║                      RENDER FORM                     ║
    // ╚═══════════════════════════════════════════════════════╝
    return (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* ===== Tipo ricorrenza ===== */}
            <div>
                <label htmlFor="ricorrenza-type" className="block text-sm font-medium mb-1">
                    Tipo
                </label>
                <select
                    id="ricorrenza-type"
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
                >
                    <option value="entrata">Entrata</option>
                    <option value="spesa">Spesa</option>
                </select>
            </div>
            {/* ===== Categoria dinamica ===== */}
            <div>
                <label htmlFor="ricorrenza-category" className="block text-sm font-medium mb-1">
                    Categoria
                </label>
                <select
                    id="ricorrenza-category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-primary focus:outline-none ${
                        errors.category_id ? "border-danger" : "border-border"
                    } bg-bg text-text`}
                    disabled={loadingCategories}
                >
                    <option value={0} disabled>
                        {loadingCategories ? "Caricamento..." : "Seleziona categoria"}
                    </option>
                    {filteredCategories.map((cat: Category) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category_id && <p className="text-danger text-xs -mt-2">{errors.category_id}</p>}
            </div>
            {/* ===== Nome ===== */}
            <div>
                <label htmlFor="ricorrenza-nome" className="block text-sm font-medium mb-1">
                    Nome ricorrenza
                </label>
                <Input
                    id="ricorrenza-nome"
                    name="nome"
                    type="text"
                    placeholder="Nome ricorrenza"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className={errors.nome ? "border-danger" : ""}
                    autoComplete="off"
                />
                {errors.nome && <p className="text-danger text-xs -mt-2">{errors.nome}</p>}
            </div>
            {/* ===== Importo ===== */}
            <div>
                <label htmlFor="ricorrenza-importo" className="block text-sm font-medium mb-1">
                    Importo
                </label>
                <Input
                    id="ricorrenza-importo"
                    name="importo"
                    type="number"
                    step="0.01"
                    placeholder="Importo"
                    value={formData.importo === 0 ? "" : formData.importo}
                    onChange={(e) => setFormData({ ...formData, importo: Number(e.target.value) || 0 })}
                    className={errors.importo ? "border-danger" : ""}
                />
                {errors.importo && <p className="text-danger text-xs -mt-2">{errors.importo}</p>}
            </div>
            {/* ===== Frequenza ===== */}
            <div>
                <label htmlFor="ricorrenza-frequenza" className="block text-sm font-medium mb-1">
                    Frequenza
                </label>
                <select
                    id="ricorrenza-frequenza"
                    name="frequenza"
                    value={formData.frequenza}
                    onChange={(e) => setFormData({ ...formData, frequenza: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                    <option value="daily">Giornaliera</option>
                    <option value="weekly">Settimanale</option>
                    <option value="monthly">Mensile</option>
                    <option value="annually">Annuale</option>
                </select>
            </div>
            {/* ===== Data prossima ===== */}
            <div>
                <label htmlFor="ricorrenza-prossima" className="block text-sm font-medium mb-1">
                    Data prossima
                </label>
                <Input
                    id="ricorrenza-prossima"
                    name="prossima"
                    type="date"
                    value={formData.prossima}
                    onChange={(e) => setFormData({ ...formData, prossima: e.target.value })}
                    className={errors.prossima ? "border-danger" : ""}
                />
                {errors.prossima && <p className="text-danger text-xs -mt-2">{errors.prossima}</p>}
            </div>
            {/* ===== Note ===== */}
            <div>
                <label htmlFor="ricorrenza-note" className="block text-sm font-medium mb-1">
                    Note (opzionale)
                </label>
                <Textarea
                    id="ricorrenza-notes"
                    name="notes"
                    placeholder="Note (opzionale)"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </div>
            {/* ===== Azioni ===== */}
            {/* ===== Azioni ===== */}
            <div className="flex gap-2 w-full mt-6">
                {/* Bottone Annulla */}
                <button
                    type="button"
                    className="
                        w-1/2
                        bg-bg-elevate
                        text-text
                        border border-bg-soft
                        rounded-xl py-2 font-semibold
                        shadow focus:ring-2 focus:ring-primary/40 transition
                    "
                    onClick={onCancel}
                    disabled={loading}
                >
                    Annulla
                </button>
                {/* Bottone Salva/Crea */}
                <button
                    type="submit"
                    className="
                        w-1/2
                        bg-primary text-white
                        rounded-xl py-2 font-semibold
                        shadow focus:ring-2 focus:ring-primary/40 transition
                    "
                    disabled={loading}
                >
                    {loading
                        ? "Salvataggio..."
                        : initialValues && initialValues.nome
                        ? "Salva modifiche"
                        : "Crea ricorrenza"}
                </button>
            </div>
        </form>
    );
}

