// ============================
// TransactionDetailModal.tsx
// Modale dettaglio transazione (reset globale, chiusura overlay, errori visibili)
// ============================

import React, { useState, useEffect, useRef } from "react";
import { X, Check, Trash2, AlertTriangle, Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import { Transaction } from "@/types/types/transaction";

// Tipi
type Category = { id: number; name: string; type: "entrata" | "spesa" };

type Props = {
    transaction: Transaction;
    onClose: () => void;
    onEdit?: (t: Transaction) => Promise<any> | void;
    onDelete?: (t: Transaction) => Promise<any> | void;
    categories: Category[];
};

export default function TransactionDetailModal({ transaction, onClose, onEdit, onDelete, categories }: Props) {
    // ================================ STATE
    const [formData, setFormData] = useState<Transaction>({ ...transaction });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState<"save" | "delete" | null>(null);
    const [showSaveTooltip, setShowSaveTooltip] = useState(false);

    // -- Per errori "live" dopo submit
    const [showErrors, setShowErrors] = useState(false);

    // -- Ref per click esterno
    const modalRef = useRef<HTMLDivElement>(null);

    // ================================ TYPE
    const [selectedType, setSelectedType] = useState<"entrata" | "spesa">(
        transaction.category?.type === "entrata" ? "entrata" : "spesa"
    );
    useEffect(() => {
        const cat = categories.find((c) => c.id === transaction.category_id || c.id === transaction.category?.id);
        setFormData({
            ...transaction,
            category_id: cat?.id ?? transaction.category_id,
            category: cat,
        });
        setSelectedType(cat?.type === "entrata" ? "entrata" : "spesa");
        setShowErrors(false); // reset errori quando cambio transazione
    }, [transaction, categories]);

    // ========== UTILS CAMPI ==========
    const filteredCategories = categories.filter((c) => c.type === selectedType);
    const borderColor =
        selectedType === "entrata" ? "border-green-400 focus:ring-green-400" : "border-red-400 focus:ring-red-400";
    const shadow = "shadow-[0_2px_10px_rgba(0,0,0,0.14)]";
    const containerBorderColor = selectedType === "entrata" ? "border-green-400" : "border-red-400";

    // --- CAMPI MODIFICATI
    function isModified<K extends keyof Transaction>(key: K) {
        return formData[key] !== transaction[key];
    }
    function resetField<K extends keyof Transaction>(key: K) {
        setFormData((fd) => ({
            ...fd,
            [key]: transaction[key],
        }));
    }
    function resetCategory() {
        const origCat = categories.find((c) => c.id === transaction.category_id);
        if (origCat) {
            setSelectedType(origCat.type);
            setFormData((fd) => ({
                ...fd,
                category_id: origCat.id,
                category: origCat,
            }));
        } else {
            // fallback: svuota, ma dovrebbe essere impossibile
            setFormData((fd) => ({
                ...fd,
                category_id: undefined,
                category: undefined,
            }));
        }
    }

    // --- RESET TUTTI I CAMPI
    function resetAllFields() {
        const cat = categories.find((c) => c.id === transaction.category_id || c.id === transaction.category?.id);
        setFormData({
            ...transaction,
            category_id: cat?.id ?? transaction.category_id,
            category: cat,
        });
        setSelectedType(cat?.type === "entrata" ? "entrata" : "spesa");
        setShowErrors(false);
    }

    // ========== ERRORI DINAMICI ==========
    const categoryError = !formData.category_id
        ? "Seleziona una categoria per poter salvare la transazione."
        : filteredCategories.find((c) => c.id === formData.category_id)
        ? ""
        : "La categoria selezionata non è valida per questo tipo.";

    const descriptionError = !formData.description?.trim() ? "La descrizione è obbligatoria." : "";

    const amountError = !formData.amount || formData.amount <= 0 ? "Importo obbligatorio e maggiore di zero." : "";

    // ===== Disabilita il salva se manca qualcosa =====
    const isSaveDisabled = !!descriptionError || !!categoryError || !!amountError || loading === "save";

    // ===== Tooltip Salva =====
    const saveTooltipMessage = descriptionError || categoryError || amountError || "";

    // ========== SALVA
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // mostra errori sotto campi se non validi
        setShowErrors(true);

        if (isSaveDisabled) {
            toast.error("Completa tutti i campi obbligatori.");
            return;
        }
        setLoading("save");
        try {
            await Promise.resolve(
                onEdit?.({
                    ...formData,
                    category: filteredCategories.find((c) => c.id === formData.category_id),
                })
            );
            toast.success("Transazione aggiornata!");
            onClose();
        } catch (err) {
            toast.error("Errore nel salvataggio.");
        } finally {
            setLoading(null);
        }
    };

    // ========== ELIMINA
    const handleDelete = async () => {
        setLoading("delete");
        try {
            await Promise.resolve(onDelete?.(transaction));
            toast.success("Transazione eliminata!");
            setShowDeleteModal(false);
            onClose();
        } catch (err) {
            toast.error("Errore nell'eliminazione.");
        } finally {
            setLoading(null);
        }
    };

    // ========== CLOSE ON OVERLAY CLICK
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // ========== RENDER ==========

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
            <div
                ref={modalRef}
                className={`bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 w-[96vw] max-w-lg relative border-2 ${containerBorderColor} flex flex-col items-center`}
            >
                {/* RESET TUTTO & CHIUDI */}
                <button
                    className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-300 text-yellow-800 rounded-lg shadow transition text-sm"
                    onClick={resetAllFields}
                    title="Resetta tutti i campi"
                    type="button"
                >
                    <Undo2 size={18} /> Reset
                </button>
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                    onClick={onClose}
                    title="Chiudi"
                    type="button"
                >
                    <X size={22} />
                </button>

                {/* SWITCH Entrata/Spesa */}
                <div className="flex justify-center mb-4 gap-2">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-l-xl font-bold text-lg border-2 border-green-500 
                            ${
                                selectedType === "entrata" ? "bg-green-600 text-white" : "bg-bg-elevate text-text"
                            } transition`}
                        onClick={() => {
                            setSelectedType("entrata");
                            setFormData((fd) => ({ ...fd, category_id: undefined, category: undefined }));
                        }}
                        disabled={loading !== null}
                    >
                        Entrata
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-r-xl font-bold text-lg border-2 border-red-500 
                            ${
                                selectedType === "spesa" ? "bg-red-600 text-white" : "bg-bg-elevate text-text"
                            } transition`}
                        onClick={() => {
                            setSelectedType("spesa");
                            setFormData((fd) => ({ ...fd, category_id: undefined, category: undefined }));
                        }}
                        disabled={loading !== null}
                    >
                        Spesa
                    </button>
                </div>

                {/* Titolo */}
                <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-light text-center tracking-tight">
                    Modifica transazione
                </h2>

                {/* Form centrato */}
                <form className="space-y-4 w-full flex flex-col items-center" onSubmit={handleSubmit}>
                    {/* === Prima riga: Importo & Data === */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        {/* === Importo === */}
                        <div className="flex flex-col items-center w-full sm:w-1/2 relative">
                            <span className="font-semibold text-text mb-1">Importo</span>
                            <input
                                type="number"
                                min={0.01}
                                step={0.01}
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                className={`w-full text-center rounded-2xl py-3 px-4 ${borderColor} ${shadow} text-lg font-semibold bg-bg-elevate transition
                                    ${isModified("amount") ? "ring-2 ring-yellow-400" : ""}
                                `}
                                required
                            />
                            {isModified("amount") && (
                                <button
                                    type="button"
                                    className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                                    title="Resetta valore"
                                    onClick={() => resetField("amount")}
                                >
                                    <X size={16} className="text-yellow-600" />
                                </button>
                            )}
                            {showErrors && amountError && (
                                <div className="text-red-500 text-xs mt-1 w-full text-center">{amountError}</div>
                            )}
                        </div>
                        {/* === Data === */}
                        <div className="flex flex-col items-center w-full sm:w-1/2 relative">
                            <span className="font-semibold text-text mb-1">Data</span>
                            <input
                                type="date"
                                value={formData.date.slice(0, 10)}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className={`w-full text-center rounded-2xl py-3 px-4 ${borderColor} ${shadow} text-lg font-semibold bg-bg-elevate transition
                                    ${isModified("date") ? "ring-2 ring-yellow-400" : ""}
                                `}
                                required
                            />
                            {isModified("date") && (
                                <button
                                    type="button"
                                    className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                                    title="Resetta valore"
                                    onClick={() => resetField("date")}
                                >
                                    <X size={16} className="text-yellow-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* === Descrizione === */}
                    <div className="flex flex-col items-center w-full relative">
                        <span className="font-semibold text-text mb-1">Descrizione</span>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full rounded-2xl py-3 px-4 ${borderColor} ${shadow} text-base bg-bg-elevate transition
                                ${isModified("description") ? "ring-2 ring-yellow-400" : ""}
                            `}
                            required
                        />
                        {isModified("description") && (
                            <button
                                type="button"
                                className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                                title="Resetta valore"
                                onClick={() => resetField("description")}
                            >
                                <X size={16} className="text-yellow-600" />
                            </button>
                        )}
                        {showErrors && descriptionError && (
                            <div className="text-red-500 text-xs mt-1 w-full text-center">{descriptionError}</div>
                        )}
                    </div>

                    {/* === Categoria === */}
                    <div className="flex flex-col items-center w-full relative">
                        <span className="font-semibold text-text mb-1">Categoria</span>
                        <select
                            value={formData.category_id || ""}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                const cat = filteredCategories.find((c) => c.id === id);
                                setFormData({
                                    ...formData,
                                    category: cat || undefined,
                                    category_id: id,
                                });
                            }}
                            className={`w-full rounded-2xl py-3 px-4 ${borderColor} ${shadow} text-base bg-bg-elevate transition
                                ${isModified("category_id") ? "ring-2 ring-yellow-400" : ""}
                            `}
                            required
                        >
                            <option value="">Seleziona</option>
                            {filteredCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {isModified("category_id") && (
                            <button
                                type="button"
                                className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                                title="Resetta valore"
                                onClick={resetCategory}
                            >
                                <X size={16} className="text-yellow-600" />
                            </button>
                        )}
                        {showErrors && categoryError && (
                            <div className="text-red-500 text-xs mt-2 w-full text-center">{categoryError}</div>
                        )}
                    </div>

                    {/* === Note === */}
                    <div className="flex flex-col items-center w-full relative">
                        <span className="font-semibold text-text mb-1">Note</span>
                        <input
                            type="text"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className={`w-full rounded-2xl py-3 px-4 ${borderColor} ${shadow} text-base bg-bg-elevate transition
                                ${isModified("notes") ? "ring-2 ring-yellow-400" : ""}
                            `}
                        />
                        {isModified("notes") && (
                            <button
                                type="button"
                                className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                                title="Resetta valore"
                                onClick={() => resetField("notes")}
                            >
                                <X size={16} className="text-yellow-600" />
                            </button>
                        )}
                    </div>
                </form>

                {/* ===== Bottoni azione grandi con tooltip salva ===== */}
                <div className="flex flex-row gap-4 mt-8 justify-center w-full">
                    <div className="relative flex-1 flex items-center justify-center">
                        <button
                            className={`flex items-center justify-center gap-2 w-full px-0 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg text-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-600
                                ${isSaveDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                            onClick={handleSubmit}
                            disabled={isSaveDisabled}
                            onMouseEnter={() => isSaveDisabled && setShowSaveTooltip(true)}
                            onMouseLeave={() => setShowSaveTooltip(false)}
                            onFocus={() => isSaveDisabled && setShowSaveTooltip(true)}
                            onBlur={() => setShowSaveTooltip(false)}
                            tabIndex={0}
                            type="button"
                        >
                            <Check size={26} /> Salva
                        </button>
                        {isSaveDisabled && showSaveTooltip && saveTooltipMessage && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-900 border border-yellow-400 rounded-xl px-3 py-1 text-sm shadow-xl z-50 whitespace-nowrap">
                                {saveTooltipMessage}
                            </div>
                        )}
                    </div>
                    {/* EXIT */}
                    <button
                        className="flex items-center justify-center gap-2 flex-1 px-0 py-3 bg-gray-300 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 font-bold rounded-2xl shadow-lg text-lg hover:bg-red-100 dark:hover:bg-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => {
                            resetAllFields();
                            onClose();
                        }}
                        disabled={loading !== null}
                    >
                        <X size={26} /> Esci
                    </button>
                    {/* DELETE */}
                    {onDelete && (
                        <button
                            className="flex items-center justify-center gap-2 flex-1 px-0 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg text-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-600"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={loading !== null}
                        >
                            <Trash2 size={24} /> Elimina
                        </button>
                    )}
                </div>

                {/* ======= Modale conferma delete ======= */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-xs w-full flex flex-col items-center border border-red-300 shadow-xl">
                            <AlertTriangle className="text-red-600 mb-2" size={36} />
                            <div className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 text-center">
                                Confermi di voler eliminare la transazione?
                            </div>
                            <div className="flex gap-4 mt-2">
                                <button
                                    className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                                    onClick={handleDelete}
                                    disabled={loading === "delete"}
                                >
                                    Sì, elimina
                                </button>
                                <button
                                    className="px-6 py-2 rounded-xl bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-400 dark:hover:bg-zinc-800"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={loading === "delete"}
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
