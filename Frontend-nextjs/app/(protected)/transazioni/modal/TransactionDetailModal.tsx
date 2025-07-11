"use client";

// ==========================================
// TransactionDetailModal — solo UI (nessun async!)
// ==========================================

import React, { useEffect, useRef, useState } from "react";
import { X, Undo2 } from "lucide-react";
import { Transaction } from "@/types/types/transaction";
import TransactionTypeSwitch from "./components/TransactionTypeSwitch";
import TransactionDetailForm from "./components/TransactionDetailForm";
import TransactionActionButtons from "./components/TransactionActionButtons";
import TransactionDeleteConfirmModal from "./components/TransactionDeleteConfirmModal";
import { useTransactions } from "@/context/contexts/TransactionsContext";

type Category = { id: number; name: string; type: "entrata" | "spesa" };
type Props = {
    transaction: Transaction;
    onClose: () => void;
    categories: Category[];
    onEdit?: (t: Transaction) => void;
    onDelete?: (t: Transaction) => void;
};

export default function TransactionDetailModal({ transaction, onClose, categories, onEdit, onDelete }: Props) {
    // UI state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<Transaction>({ ...transaction });
    const [selectedType, setSelectedType] = useState<"entrata" | "spesa">(
        transaction.category?.type === "entrata" ? "entrata" : "spesa"
    );
    const [showErrors, setShowErrors] = useState(false);
    const [loading, setLoading] = useState<"save" | "delete" | null>(null);

    useEffect(() => {
        const cat = categories.find((c) => c.id === transaction.category_id || c.id === transaction.category?.id);
        setFormData({
            ...transaction,
            category_id: cat?.id ?? transaction.category_id,
            category: cat,
        });
        setSelectedType(cat?.type === "entrata" ? "entrata" : "spesa");
        setShowErrors(false);
    }, [transaction, categories]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // VALIDAZIONE FORM
    const filteredCategories = categories.filter((c) => c.type === selectedType);
    const categoryError = !formData.category_id
        ? "Seleziona una categoria per poter salvare la transazione."
        : filteredCategories.find((c) => c.id === formData.category_id)
        ? ""
        : "La categoria selezionata non è valida per questo tipo.";
    const descriptionError = !formData.description?.trim() ? "La descrizione è obbligatoria." : "";
    const amountError = !formData.amount || formData.amount <= 0 ? "Importo obbligatorio e maggiore di zero." : "";
    const isSaveDisabled = !!descriptionError || !!categoryError || !!amountError;
    const saveTooltipMessage = descriptionError || categoryError || amountError || "";

    // --- SALVA: chiudi la modale SUBITO, passa al parent la logica async ---
    const handleSave = () => {
        setShowErrors(true);
        if (isSaveDisabled) return;
        onEdit?.({ ...formData, type: selectedType });
        onClose(); // Chiudi subito!
    };

    // --- DELETE: chiudi subito, gestisci async sopra ---
    const handleDelete = () => {
        onDelete?.(transaction);
        setShowDeleteModal(false);
        onClose();
    };

    // --- RESET FORM ---
    const handleReset = () => {
        const cat = categories.find((c) => c.id === transaction.category_id || c.id === transaction.category?.id);
        setFormData({
            ...transaction,
            category_id: cat?.id ?? transaction.category_id,
            category: cat,
        });
        setSelectedType(cat?.type === "entrata" ? "entrata" : "spesa");
        setShowErrors(false);
    };

    // --- RENDER ---
    return (
        <div className="fixed inset-0 bg-bg/80 z-40 flex items-center justify-center">
            <div
                ref={modalRef}
                className={`
                    bg-bg-elevate rounded-3xl shadow-2xl p-8 w-[96vw] max-w-lg relative border-2
                    ${selectedType === "entrata" ? "border-success" : "border-danger"} flex flex-col items-center
                `}
            >
                {/* RESET & CHIUDI */}
                <button
                    className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-warning text-warning-dark hover:bg-warning-dark hover:text-warning rounded-lg shadow transition text-sm"
                    onClick={handleReset}
                    title="Resetta tutti i campi"
                    type="button"
                >
                    <Undo2 size={18} /> Reset
                </button>
                <button
                    className="absolute top-4 right-4 text-text hover:text-danger transition"
                    onClick={onClose}
                    title="Chiudi"
                    type="button"
                >
                    <X size={22} />
                </button>

                {/* TITOLO */}
                <div className="w-full flex flex-col items-center mb-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 shadow-sm">
                        {/* Icona moderna */}
                        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary">
                            <path
                                d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.07-6.07-1.41 1.41M7.34 16.66l-1.41 1.41m12.73 0-1.41-1.41M7.34 7.34 5.93 5.93"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                    <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent text-center tracking-tight drop-shadow-sm">
                        Modifica transazione
                    </h2>
                    <span className="block text-sm text-text-secondary mt-1">Aggiorna i dettagli e salva</span>
                </div>

                {/* SWITCH ENTRATA/SPESA */}
                <TransactionTypeSwitch
                    selectedType={selectedType}
                    setSelectedType={(type) => {
                        setSelectedType(type);
                        setFormData((fd) => ({
                            ...fd,
                            category_id: undefined,
                            category: undefined,
                        }));
                    }}
                    disabled={false}
                />

                {/* FORM DETTAGLIO */}
                <TransactionDetailForm
                    formData={formData}
                    setFormData={setFormData}
                    selectedType={selectedType}
                    categories={categories}
                    showErrors={showErrors}
                    transaction={transaction}
                />

                <TransactionActionButtons
                    onSave={handleSave}
                    onClose={onClose}
                    onDelete={onDelete ? () => setShowDeleteModal(true) : undefined}
                    loading={loading}
                    isSaveDisabled={isSaveDisabled}
                    saveTooltipMessage={saveTooltipMessage}
                />

                {/* MODALE DELETE */}
                {showDeleteModal && (
                    <TransactionDeleteConfirmModal
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteModal(false)}
                        loading={false}
                    />
                )}
            </div>
        </div>
    );
}
