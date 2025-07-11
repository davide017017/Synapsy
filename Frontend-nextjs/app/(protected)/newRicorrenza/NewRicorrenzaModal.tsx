"use client";

// =====================================================
// NewRicorrenzaModal.tsx — Modale ricorrenza (con nome categoria nell’overlay)
// =====================================================

import { useState, useMemo } from "react";
import Dialog from "@/app/components/ui/Dialog";
import NewRicorrenzaForm from "./NewRicorrenzaForm";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { Ricorrenza, RicorrenzaBase } from "@/types/types/ricorrenza";

type Props = {
    open: boolean;
    onClose: () => void;
    ricorrenzaToEdit?: Ricorrenza | null;
    onSave: (data: RicorrenzaBase) => Promise<void>;
};

export default function NewRicorrenzaModal({ open, onClose, ricorrenzaToEdit, onSave }: Props) {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<Partial<RicorrenzaBase>>({});
    const { categories } = useCategories();

    // Trova nome categoria in edit (già presente in ricorrenzaToEdit se la mappi dal backend, sennò via id)
    const editCategoryName = useMemo(() => {
        if (!ricorrenzaToEdit?.category_id) return undefined;
        return categories.find((cat) => cat.id === ricorrenzaToEdit.category_id)?.name || ricorrenzaToEdit.categoria; // fallback a campo join se c'è
    }, [ricorrenzaToEdit, categories]);

    // Trova nome categoria mentre compili il form
    const formCategoryName = useMemo(() => {
        if (!formValues.category_id) return undefined;
        return categories.find((cat) => cat.id === formValues.category_id)?.name;
    }, [formValues.category_id, categories]);

    // Salva (crea o aggiorna)
    const handleSave = async (data: RicorrenzaBase) => {
        setLoading(true);
        try {
            await onSave(data);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // Render
    // =====================================================
    return (
        <Dialog open={open} onClose={onClose}>
            <div className="relative p-6 min-w-[320px] max-w-[430px]">
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
                <h2 className="text-xl font-bold mb-4">
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
