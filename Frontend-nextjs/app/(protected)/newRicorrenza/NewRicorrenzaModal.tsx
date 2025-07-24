"use client";

// =====================================================
// NewRicorrenzaModal.tsx — Modale uniforme, utility/semantic
// =====================================================

import { useState, useMemo } from "react";
import Dialog from "@/app/components/ui/Dialog";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import NewRicorrenzaForm from "./NewRicorrenzaForm";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { Ricorrenza, RicorrenzaBase } from "@/types/models/ricorrenza";
import type { NewRicorrenzaModalProps } from "@/types";

// ============================
// Componente principale
// ============================
export default function NewRicorrenzaModal({ open, onClose, ricorrenzaToEdit, onSave }: NewRicorrenzaModalProps) {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<Partial<RicorrenzaBase>>({});
    const { categories } = useCategories();

    // Nome categoria per overlay info
    const editCategoryName = useMemo(
        () =>
            ricorrenzaToEdit?.category_id
                ? categories.find((cat) => cat.id === ricorrenzaToEdit.category_id)?.name || ricorrenzaToEdit.categoria
                : undefined,
        [ricorrenzaToEdit, categories]
    );
    const formCategoryName = useMemo(
        () => (formValues.category_id ? categories.find((cat) => cat.id === formValues.category_id)?.name : undefined),
        [formValues.category_id, categories]
    );

    // Salva handler
    const handleSave = async (data: RicorrenzaBase) => {
        setLoading(true);
        try {
            await onSave(data);
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Render
    // ============================
    return (
        <Dialog open={open} onClose={onClose}>
            <div
                className="
                    relative w-full max-w-lg min-w-[320px]
                    text-text rounded-2xl shadow-2xl shadow-black/30 border border-bg-elevate
                    p-6
                "
            >
                {/* Overlay loading */}
                <LoadingOverlay
                    show={loading}
                    icon="🔁"
                    message={ricorrenzaToEdit ? "Sto aggiornando la ricorrenza…" : "Sto creando la ricorrenza…"}
                    subMessage={
                        ricorrenzaToEdit ? (
                            <>
                                {`• Nome: "${ricorrenzaToEdit.nome}"`}
                                <br />
                                {`• Importo: ${ricorrenzaToEdit.importo} €`}
                                <br />
                                {`• Frequenza: ${ricorrenzaToEdit.frequenza}`}
                                <br />
                                {editCategoryName && `• Categoria: ${editCategoryName}`}
                            </>
                        ) : formValues.nome ? (
                            <>
                                {`• Nome: "${formValues.nome}"`}
                                <br />
                                {formValues.importo && `• Importo: ${formValues.importo} €`}
                                <br />
                                {formValues.frequenza && `• Frequenza: ${formValues.frequenza}`}
                                <br />
                                {formCategoryName && `• Categoria: ${formCategoryName}`}
                            </>
                        ) : (
                            "Attendi…"
                        )
                    }
                />

                {/* Titolo */}
                <h2 className="text-xl font-bold mb-4 text-primary">
                    {ricorrenzaToEdit ? "Modifica ricorrenza" : "Nuova ricorrenza"}
                </h2>
                {/* Form */}
                <NewRicorrenzaForm
                    initialValues={ricorrenzaToEdit || undefined}
                    onSave={handleSave}
                    onCancel={onClose}
                    onChangeForm={setFormValues}
                />
            </div>
        </Dialog>
    );
}
