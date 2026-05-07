"use client";

// =====================================================
// NewTransactionModal.tsx — Modale uniforme Tx
// =====================================================

import { useState, useMemo } from "react";
import Dialog from "@/app/components/ui/Dialog";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import NewTransactionForm from "./NewTransactionForm";
import { useTransactions } from "@/context/TransactionsContext";
import { useCategories } from "@/context/CategoriesContext";
import { eur } from "@/utils/formatCurrency";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

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
    // ───────── Stato modale / tx ─────────
    const { isOpen, closeModal, transactionToEdit, create, update, remove } = useTransactions();
    const { categories } = useCategories();
    const [loadingAction, setLoadingAction] = useState<"save" | "delete" | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formValues, setFormValues] = useState<Partial<any>>({});

    // ───────── Stato: picker categoria aperto? ─────────
    const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

    // ───────── Info per overlay loading ─────────
    const editCategoryName = useMemo(
        () =>
            transactionToEdit?.category_id
                ? categories.find((cat) => cat.id === transactionToEdit.category_id)?.name
                : undefined,
        [transactionToEdit, categories],
    );

    const formCategoryName = useMemo(
        () => (formValues.category_id ? categories.find((cat) => cat.id === formValues.category_id)?.name : undefined),
        [formValues.category_id, categories],
    );

    // ───────── Salvataggio ─────────
    const handleSave = async (data: any) => {
        setLoadingAction("save");
        try {
            if (transactionToEdit) await update(transactionToEdit.id, data);
            else await create(data);
        } finally {
            setLoadingAction(null);
        }
    };

    // ───────── Eliminazione ─────────
    const handleDelete = async () => {
        if (!transactionToEdit) return;
        setShowDeleteConfirm(false);
        setLoadingAction("delete");
        try {
            await remove(transactionToEdit.id);
        } finally {
            setLoadingAction(null);
        }
    };

    // ───────── Gestione chiusura Dialog ─────────
    // Se il picker è aperto: chiude SOLO il picker.
    // Se il picker è chiuso: chiude la modale normalmente.
    const handleDialogClose = () => {
        if (isCategoryPickerOpen) {
            setIsCategoryPickerOpen(false);
            return;
        }
        closeModal?.();
    };

    // ────────────────────────────────────────────────
    // Derived loading state
    // ────────────────────────────────────────────────
    const isLoading = !!loadingAction;

    const overlayMessage =
        loadingAction === "delete"
            ? "Eliminazione in corso…"
            : transactionToEdit
              ? "Sto salvando la tua modifica…"
              : "Sto creando la nuova transazione!";

    const overlaySubMessage =
        loadingAction === "delete" ? (
            <>
                {transactionToEdit && `• "${transactionToEdit.description}"`}
                <br />
                {transactionToEdit?.amount && `• ${eur(transactionToEdit.amount)}`}
            </>
        ) : transactionToEdit ? (
            <>
                {`• Descrizione: "${transactionToEdit.description}"`}
                <br />
                {`• Importo: ${eur(transactionToEdit.amount)}`}
                <br />
                {transactionToEdit.date && `• Data: ${transactionToEdit.date}`}
                <br />
                {editCategoryName && `• Categoria: ${editCategoryName}`}
            </>
        ) : formValues.description ? (
            <>
                {`• Descrizione: "${formValues.description}"`}
                <br />
                {formValues.amount && `• Importo: ${eur(formValues.amount)}`}
                <br />
                {formValues.date && `• Data: ${formValues.date}`}
                <br />
                {formCategoryName && `• Categoria: ${formCategoryName}`}
            </>
        ) : (
            "Un attimo di pazienza!"
        );

    // ============================
    // Render
    // ============================
    return (
        <Dialog open={isOpen} onClose={handleDialogClose}>
            <div
                className="
                relative w-full max-w-lg min-w-[320px]
                max-h-[100vh]              /* 👈 limite viewport */
                overflow-y-auto           /* 👈 scroll interno */
                overscroll-contain
                text-text rounded-2xl
                shadow-2xl shadow-black/30
                bg-bg
                p-4 sm:p-5
              "
            >
                {/* ───────── Overlay loading ───────── */}
                <LoadingOverlay show={isLoading} icon="💸" message={overlayMessage} subMessage={overlaySubMessage} />

                {/* ───────── Form ───────── */}
                <div className={isLoading ? "pointer-events-none opacity-50" : ""}>
                    <NewTransactionForm
                        onSave={handleSave}
                        transaction={transactionToEdit ?? undefined}
                        disabled={isLoading}
                        onChangeForm={setFormValues}
                        onCancel={closeModal}
                        initialDate={!transactionToEdit ? defaultDate : undefined}
                        initialType={!transactionToEdit ? defaultType : undefined}
                        // 🔥 stato picker passato al form
                        categoryPickerOpen={isCategoryPickerOpen}
                        onCategoryPickerOpenChange={setIsCategoryPickerOpen}
                        onDelete={transactionToEdit ? () => setShowDeleteConfirm(true) : undefined}
                    />
                </div>
            </div>

            {/* ───────── Conferma eliminazione ───────── */}
            <ConfirmDialog
                open={showDeleteConfirm}
                type="delete"
                title="Confermi di voler eliminare la transazione?"
                highlight={
                    transactionToEdit ? (
                        <div className="flex flex-col items-center">
                            <span className="italic">{transactionToEdit.description}</span>
                            {transactionToEdit.amount && <span>{eur(transactionToEdit.amount)}</span>}
                            {transactionToEdit.category?.name && <span>{transactionToEdit.category.name}</span>}
                        </div>
                    ) : undefined
                }
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                loading={loadingAction === "delete"}
            />
        </Dialog>
    );
}
