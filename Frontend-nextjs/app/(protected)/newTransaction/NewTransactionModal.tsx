"use client";

// =====================================================
// NewTransactionModal.tsx — Modale uniforme, utility/semantic
// =====================================================

import { useState, useMemo } from "react";
import Dialog from "@/app/components/ui/Dialog";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import NewTransactionForm from "./NewTransactionForm";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { useCategories } from "@/context/contexts/CategoriesContext";

// ============================
// Componente principale
// ============================
export default function NewTransactionModal({
    defaultDate,
    defaultType,
}: {
    defaultDate?: string;
    defaultType?: "entrata" | "spesa";
}) {
    const { isOpen, closeModal, transactionToEdit, create, update } = useTransactions();
    const { categories } = useCategories();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<Partial<any>>({});

    // Nome categoria per overlay info
    const editCategoryName = useMemo(
        () =>
            transactionToEdit?.category_id
                ? categories.find((cat) => cat.id === transactionToEdit.category_id)?.name
                : undefined,
        [transactionToEdit, categories]
    );
    const formCategoryName = useMemo(
        () => (formValues.category_id ? categories.find((cat) => cat.id === formValues.category_id)?.name : undefined),
        [formValues.category_id, categories]
    );

    // Salva handler
    const handleSave = async (data: any) => {
        setLoading(true);
        try {
            if (transactionToEdit) await update(transactionToEdit.id, data);
            else await create(data);
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Render
    // ============================
    return (
        <Dialog open={isOpen} onClose={closeModal ?? (() => {})}>
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
                    icon="💸"
                    message={transactionToEdit ? "Sto salvando la tua modifica…" : "Sto creando la nuova transazione!"}
                    subMessage={
                        transactionToEdit ? (
                            <>
                                {`• Descrizione: "${transactionToEdit.description}"`}
                                <br />
                                {`• Importo: ${transactionToEdit.amount} €`}
                                <br />
                                {transactionToEdit.date && `• Data: ${transactionToEdit.date}`}
                                <br />
                                {editCategoryName && `• Categoria: ${editCategoryName}`}
                            </>
                        ) : formValues.description ? (
                            <>
                                {`• Descrizione: "${formValues.description}"`}
                                <br />
                                {formValues.amount && `• Importo: ${formValues.amount} €`}
                                <br />
                                {formValues.date && `• Data: ${formValues.date}`}
                                <br />
                                {formCategoryName && `• Categoria: ${formCategoryName}`}
                            </>
                        ) : (
                            "Un attimo di pazienza!"
                        )
                    }
                />

                {/* Titolo */}
                <h2 className="text-xl font-bold mb-4 text-primary">
                    {transactionToEdit ? "Modifica transazione" : "Aggiungi transazione"}
                </h2>
                {/* Form */}
                <div className={loading ? "pointer-events-none opacity-50" : ""}>
                    <NewTransactionForm
                        onSave={handleSave}
                        transaction={transactionToEdit ?? undefined}
                        disabled={loading}
                        onChangeForm={setFormValues}
                        onCancel={closeModal}
                        initialDate={!transactionToEdit ? defaultDate : undefined}
                        initialType={!transactionToEdit ? defaultType : undefined}
                    />
                </div>
            </div>
        </Dialog>
    );
}
