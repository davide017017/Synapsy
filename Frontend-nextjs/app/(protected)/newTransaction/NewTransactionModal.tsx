"use client";

// ==============================================
// NewTransactionModal.tsx — Modale transazione
// ==============================================

import Dialog from "@/app/components/ui/Dialog";
import NewTransactionForm from "./NewTransactionForm";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { useState, useMemo } from "react";

// ==============================================
// COMPONENTE PRINCIPALE
// ==============================================
export default function NewTransactionModal() {
    const { isOpen, closeModal, transactionToEdit, create, update } = useTransactions();
    const { categories } = useCategories();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<Partial<any>>({}); // tipizza meglio se hai TransactionBase

    // Trova il nome categoria dalla lista per edit
    const editCategoryName = useMemo(() => {
        if (!transactionToEdit?.category_id) return undefined;
        return categories.find((cat) => cat.id === transactionToEdit.category_id)?.name;
    }, [transactionToEdit, categories]);

    // Trova il nome categoria dalla lista per creazione (mentre compili)
    const formCategoryName = useMemo(() => {
        if (!formValues.category_id) return undefined;
        return categories.find((cat) => cat.id === formValues.category_id)?.name;
    }, [formValues.category_id, categories]);

    // ===== Handler salva (crea o aggiorna) =====
    const handleSave = async (data: any) => {
        setLoading(true);
        try {
            if (transactionToEdit) await update(transactionToEdit.id, data);
            else await create(data);
        } finally {
            setLoading(false);
        }
    };

    // ===== Render =====
    return (
        <Dialog
            open={isOpen}
            onClose={closeModal ?? (() => {})}
            title={transactionToEdit ? "Modifica Transazione" : "Aggiungi Transazione"}
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

            {/* Form */}
            <div className={loading ? "pointer-events-none opacity-50" : ""}>
                <NewTransactionForm
                    onSave={handleSave}
                    transaction={transactionToEdit ?? undefined}
                    disabled={loading}
                    onChangeForm={setFormValues}
                />
            </div>
        </Dialog>
    );
}
