"use client";

// =======================================================
// NewRicorrenzaForm.tsx
// Form riusabile per create/edit (con debug avanzato frequenza!)
// =======================================================

import { useState, useMemo, useEffect } from "react";
import { Ricorrenza, RicorrenzaBase } from "@/types/types/ricorrenza";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";

// =======================================================
// Helper: formatta sempre la data per input type="date"
// =======================================================
function toDateInputValue(dateString?: string) {
    if (!dateString) return new Date().toISOString().split("T")[0];
    const d = new Date(dateString);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

// =======================================================
// Props tipizzate
// =======================================================
type Props = {
    onSave: (data: RicorrenzaBase) => Promise<void>;
    onCancel: () => void;
    initialValues?: Partial<RicorrenzaBase>;
};

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function NewRicorrenzaForm({ onSave, onCancel, initialValues }: Props) {
    const { categories, loading: loadingCategories } = useCategories();

    // --------- Stato dati form (con valori iniziali se edit) ---------
    const [formData, setFormData] = useState<RicorrenzaBase>({
        nome: initialValues?.nome || "",
        importo: initialValues?.importo || 0,
        frequenza: initialValues?.frequenza || "monthly", // ⚠️ Usa sempre la chiave accettata dal backend!
        prossima: toDateInputValue(initialValues?.prossima),
        category_id: initialValues?.category_id || 0,
        note: initialValues?.note || "",
        type: initialValues?.type || "entrata",
        is_active: initialValues?.is_active ?? 1,
        interval: initialValues?.interval || 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // ===========================
    // Debug: cosa arriva come initialValues?
    useEffect(() => {
        console.log("[Form INIT] initialValues:", initialValues);
    }, [initialValues]);

    // ===========================
    // Sincronizza il form se cambia initialValues
    useEffect(() => {
        if (initialValues) {
            setFormData((prev) => ({
                ...prev,
                ...initialValues,
                prossima: toDateInputValue(initialValues.prossima),
                importo: initialValues.importo ?? 0,
                is_active: initialValues.is_active ?? 1,
                interval: initialValues.interval ?? 1,
            }));
        }
    }, [initialValues]);

    // --------- Filtra categorie per tipo dinamicamente ---------
    const filteredCategories = useMemo(
        () => categories.filter((cat) => cat.type === formData.type),
        [categories, formData.type]
    );

    // ===========================
    // Debug: ogni volta che cambia la frequenza nel form
    useEffect(() => {
        console.log("[FormData] Cambiata frequenza nel form:", formData.frequenza);
    }, [formData.frequenza]);

    // ===========================
    // Handle submit
    // ===========================
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

        // Debug: payload che stai per inviare
        console.log("[SUBMIT] Payload inviato:", formData);

        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    // =======================================================
    // Render
    // =======================================================
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* --------- Tipo ricorrenza (entrata/spesa) --------- */}
            <select
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

            {/* --------- Categoria dinamica --------- */}
            <select
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
                {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            {errors.category_id && <p className="text-danger text-xs -mt-2">{errors.category_id}</p>}

            {/* --------- Nome --------- */}
            <Input
                type="text"
                placeholder="Nome ricorrenza"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className={errors.nome ? "border-danger" : ""}
            />
            {errors.nome && <p className="text-danger text-xs -mt-2">{errors.nome}</p>}

            {/* --------- Importo --------- */}
            <Input
                type="number"
                step="0.01"
                placeholder="Importo"
                value={formData.importo === 0 ? "" : formData.importo}
                onChange={(e) => setFormData({ ...formData, importo: parseFloat(e.target.value) || 0 })}
                className={errors.importo ? "border-danger" : ""}
            />
            {errors.importo && <p className="text-danger text-xs -mt-2">{errors.importo}</p>}

            {/* --------- Frequenza (SOLO valori accettati dal backend!) --------- */}
            <select
                value={formData.frequenza}
                onChange={(e) => setFormData({ ...formData, frequenza: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-bg text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
                <option value="daily">Giornaliera</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
                <option value="annually">Annuale</option>
            </select>

            {/* --------- Data prossima --------- */}
            <Input
                type="date"
                value={formData.prossima}
                onChange={(e) => setFormData({ ...formData, prossima: e.target.value })}
                className={errors.prossima ? "border-danger" : ""}
            />
            {errors.prossima && <p className="text-danger text-xs -mt-2">{errors.prossima}</p>}

            {/* --------- Note --------- */}
            <Textarea
                placeholder="Note (opzionale)"
                value={formData.note || ""}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />

            {/* --------- Azioni --------- */}
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    className="bg-bg-elevate border border-border text-text hover:bg-bg transition"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Annulla
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvataggio..." : "Salva"}
                </Button>
            </div>
        </form>
    );
}

// =======================================================
// END NewRicorrenzaForm.tsx
// =======================================================
