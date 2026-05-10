"use client";

// =====================================================
// NewRicorrenzaModal.tsx — Modale uniforme, utility/semantic
// =====================================================

import { useState, useMemo } from "react";
import Dialog from "@/app/components/ui/Dialog";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import NewRicorrenzaForm from "./NewRicorrenzaForm";
import { useCategories } from "@/context/CategoriesContext";
import { Ricorrenza, RicorrenzaBase } from "@/types/models/ricorrenza";
import type { NewRicorrenzaModalProps } from "@/types";
import { eur } from "@/utils/formatCurrency";

// ============================
// Componente principale
// ============================
export default function NewRicorrenzaModal({ open, onClose, ricorrenzaToEdit, onSave }: NewRicorrenzaModalProps) {
    const [loadingAction, setLoadingAction] = useState<"save" | "delete" | null>(null);
    const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

    // Intercetta la chiusura del Dialog: se il picker è aperto, chiude solo il picker
    const handleClose = () => {
        if (isCategoryPickerOpen) {
            setIsCategoryPickerOpen(false);
            return;
        }
        onClose();
    };
    const [formValues, setFormValues] = useState<Partial<RicorrenzaBase>>({});
    const { categories } = useCategories();

    // Nome categoria per overlay info
    const editCategoryName = useMemo(
        () =>
            ricorrenzaToEdit?.category_id
                ? categories.find((cat) => cat.id === ricorrenzaToEdit.category_id)?.name || ricorrenzaToEdit.categoria
                : undefined,
        [ricorrenzaToEdit, categories],
    );
    const formCategoryName = useMemo(
        () => (formValues.category_id ? categories.find((cat) => cat.id === formValues.category_id)?.name : undefined),
        [formValues.category_id, categories],
    );

    // ────────────────────────────────────────────────
    // Derived loading state
    // ────────────────────────────────────────────────
    const isLoading = !!loadingAction;

    const overlayMessage =
        loadingAction === "delete"
            ? "Eliminazione in corso…"
            : ricorrenzaToEdit
              ? "Sto salvando la modifica…"
              : "Sto creando la ricorrenza…";

    // Salva handler
    const handleSave = async (data: RicorrenzaBase) => {
        setLoadingAction("save");
        try {
            await onSave(data);
        } finally {
            setLoadingAction(null);
        }
    };

    // ────────────────────────────────────────────────
    // Accent UI entrata/spesa
    // ────────────────────────────────────────────────
    const currentType = formValues.type ?? ricorrenzaToEdit?.type ?? "entrata";

    const typeAccent = currentType === "entrata" ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";

    // ============================
    // Render
    // ============================
    return (
        <Dialog open={open} onClose={handleClose}>
            <div
                className="
                    relative
                    w-full max-w-lg min-w-[320px]
                    max-h-[90vh]
                    overflow-y-auto overscroll-contain
                    rounded-2xl
                                    border border-white/10
                    bg-black/70
                    text-foreground
                    backdrop-blur-xl
                    p-6
                    shadow-[0_24px_80px_rgba(0,0,0,0.55)]
                "
            >
                {/* Overlay loading */}
                <LoadingOverlay
                    show={isLoading}
                    icon="🔁"
                    message={overlayMessage}
                    subMessage={
                        ricorrenzaToEdit ? (
                            <>
                                {`• Nome: "${ricorrenzaToEdit.nome}"`}
                                <br />
                                {`• Importo: ${eur(ricorrenzaToEdit.importo)}`}
                                <br />
                                {`• Frequenza: ${ricorrenzaToEdit.frequenza}`}
                                <br />
                                {editCategoryName && `• Categoria: ${editCategoryName}`}
                            </>
                        ) : formValues.nome ? (
                            <>
                                {`• Nome: "${formValues.nome}"`}
                                <br />
                                {formValues.importo && `• Importo: ${eur(formValues.importo)}`}
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
                <h2
                    className="
                        mb-5
                        font-mono
                        text-sm
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-center
                    "
                    style={{
                        color: typeAccent,
                        textShadow: `0 0 12px ${typeAccent}`,
                    }}
                >
                    {ricorrenzaToEdit ? "Modifica ricorrenza" : "Nuova ricorrenza"}
                </h2>
                {/* Form */}
                <NewRicorrenzaForm
                    initialValues={ricorrenzaToEdit || undefined}
                    onSave={handleSave}
                    onCancel={handleClose}
                    onChangeForm={setFormValues}
                    categoryPickerOpen={isCategoryPickerOpen}
                    onCategoryPickerOpenChange={setIsCategoryPickerOpen}
                />
            </div>
        </Dialog>
    );
}
