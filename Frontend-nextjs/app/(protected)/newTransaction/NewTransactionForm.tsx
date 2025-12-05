"use client";

/* ╔══════════════════════════════════════════════════════╗
 * ║   NewTransactionForm — Form creazione/modifica Tx   ║
 * ╚══════════════════════════════════════════════════════╝ */

import { useState, useMemo, useEffect } from "react";
import type { CSSProperties } from "react";
import { TransactionBase } from "@/types";
import type { NewTransactionFormProps } from "@/types";
import { useCategories } from "@/context/CategoriesContext";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

// ────────────────────────────────────────────────
// Icone React Icons
// ────────────────────────────────────────────────
import { FaCar, FaGift, FaEllipsisH, FaMoneyBillWave, FaChartLine, FaGamepad, FaPlane } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { FiHome } from "react-icons/fi";
import { MdOutlineLightbulb, MdLocalHospital } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";

const CATEGORY_ICONS: Record<string, JSX.Element> = {
    GiKnifeFork: <GiKnifeFork className="text-3xl" />,
    FaCar: <FaCar className="text-3xl" />,
    FiHome: <FiHome className="text-3xl" />,
    MdOutlineLightbulb: <MdOutlineLightbulb className="text-3xl" />,
    FaGamepad: <FaGamepad className="text-3xl" />,
    MdLocalHospital: <MdLocalHospital className="text-3xl" />,
    PiStudentBold: <PiStudentBold className="text-3xl" />,
    FaPlane: <FaPlane className="text-3xl" />,
    FaGift: <FaGift className="text-3xl" />,
    FaEllipsisH: <FaEllipsisH className="text-3xl" />,
    FaMoneyBillWave: <FaMoneyBillWave className="text-3xl" />,
    FaChartLine: <FaChartLine className="text-3xl" />,
};

// ────────────────────────────────────────────────
// Helper per classi dinamiche
// ────────────────────────────────────────────────
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

// ────────────────────────────────────────────────
// Icona categoria (usa campo icon se esiste, altrimenti fallback)
// ────────────────────────────────────────────────
function getCategoryIcon(cat: { icon?: string; type: "entrata" | "spesa" }) {
    if (cat.icon && CATEGORY_ICONS[cat.icon]) {
        return CATEGORY_ICONS[cat.icon];
    }
    return <span className="text-2xl">{cat.type === "entrata" ? "⬆️" : "⬇️"}</span>;
}

// ────────────────────────────────────────────────
// Utility: aggiunge alpha a un colore hex #RRGGBB → #RRGGBBAA
// ────────────────────────────────────────────────
function withAlpha(hex: string | undefined, alphaHex: string) {
    if (!hex) return undefined;
    if (!hex.startsWith("#") || hex.length !== 7) return hex; // se non è #RRGGBB, lascio com'è
    return hex + alphaHex;
}

// ────────────────────────────────────────────────
// Stile card categoria basato sul colore da DB
// ────────────────────────────────────────────────
function getCategoryStyle(cat: { color?: string; type: "entrata" | "spesa" }, isActive: boolean): CSSProperties {
    const fallback = cat.type === "entrata" ? "#22c55e" : "#ef4444"; // se manca color
    const base = cat.color || fallback;

    return {
        background: `linear-gradient(135deg, ${withAlpha(base, "20")}, ${withAlpha(base, "08")})`,
        borderColor: withAlpha(base, isActive ? "AA" : "55"),
        boxShadow: isActive
            ? `0 0 18px ${withAlpha(base, "55")}, inset 0 0 18px ${withAlpha(base, "33")}`
            : `inset 0 0 14px ${withAlpha(base, "22")}`,
    };
}

// ╔═══════════════════════════════╗
// ║      COMPONENTE PRINCIPALE    ║
// ╚═══════════════════════════════╝
export default function NewTransactionForm({
    onSave,
    transaction,
    disabled,
    onChangeForm,
    onCancel,
    initialDate,
    initialType,
    categoryPickerOpen,
    onCategoryPickerOpenChange,
}: NewTransactionFormProps) {
    // ────────────────────────────────────────────────
    // Stato form
    // ────────────────────────────────────────────────
    const [formData, setFormData] = useState<TransactionBase>({
        description: "",
        amount: "" as any,
        date: initialDate || new Date().toISOString().split("T")[0],
        category_id: 0,
        notes: "",
        type: initialType || "entrata",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // ────────────────────────────────────────────────
    // Context categorie
    // ────────────────────────────────────────────────
    const { categories, loading: loadingCategories } = useCategories();

    // ────────────────────────────────────────────────
    // Picker categoria (stato gestito dal parent)
    // ────────────────────────────────────────────────
    const showCategoryPicker = categoryPickerOpen ?? false;

    const openCategoryPicker = () => onCategoryPickerOpenChange?.(true);
    const closeCategoryPicker = () => onCategoryPickerOpenChange?.(false);

    // ────────────────────────────────────────────────
    // Inizializza dati se in edit / reset con iniziali
    // ────────────────────────────────────────────────
    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date.split("T")[0],
                category_id: transaction.category_id,
                notes: transaction.notes || "",
                type: transaction.type,
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                ...(initialDate ? { date: initialDate } : {}),
                ...(initialType ? { type: initialType } : {}),
            }));
        }
    }, [transaction, initialDate, initialType]);

    // ────────────────────────────────────────────────
    // Comunica dati aggiornati al parent
    // ────────────────────────────────────────────────
    useEffect(() => {
        onChangeForm && onChangeForm(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    // ────────────────────────────────────────────────
    // Filtra categorie per tipo corrente
    // ────────────────────────────────────────────────
    const filteredCategories = useMemo(
        () => categories.filter((cat) => cat.type === formData.type),
        [categories, formData.type]
    );

    // ────────────────────────────────────────────────
    // Submit + Validazione
    // ────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errs: Record<string, string> = {};
        if (!formData.description.trim()) errs.description = "La descrizione è obbligatoria";
        if (!formData.category_id) errs.category_id = "Seleziona una categoria";
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
            errs.amount = "L’importo deve essere maggiore di 0";

        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await onSave?.({
                ...formData,
                amount: Number(formData.amount),
            });
        } catch (err) {
            // errore gestito a livello superiore
        } finally {
            setLoading(false);
        }
    };

    // ╔═══════════════════════════════╗
    // ║          RENDER FORM          ║
    // ╚═══════════════════════════════╝
    return (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div
                className={cn(
                    "rounded-2xl border px-4 py-4 mb-1 transition-colors",
                    formData.type === "entrata" ? "border-emerald-500/80" : "border-rose-500/80"
                )}
            >
                {/* ────────────────────────────────────
                 * Toggle tipo (Entrata / Spesa)
                 * ──────────────────────────────────── */}
                <div className="flex gap-3">
                    {/* Pulsante ENTRATA */}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                type: "entrata",
                                category_id: 0,
                            })
                        }
                        disabled={!!transaction}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center rounded-xl border px-4 py-3 transition",
                            formData.type === "entrata"
                                ? "border-emerald-500 text-emerald-400 shadow"
                                : "border-border text-muted-foreground hover:border-emerald-500/60 hover:text-emerald-300/90"
                        )}
                    >
                        <span className="text-base font-bold tracking-wide">ENTRATA</span>
                        <span className="text-[11px] opacity-70 mt-1">aggiungi entrata</span>
                    </button>

                    {/* Pulsante SPESA */}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                type: "spesa",
                                category_id: 0,
                            })
                        }
                        disabled={!!transaction}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center rounded-xl border px-4 py-3 transition",
                            formData.type === "spesa"
                                ? "border-rose-500 text-rose-400 shadow"
                                : "border-border text-muted-foreground hover:border-rose-500/60 hover:text-rose-300/90"
                        )}
                    >
                        <span className="text-base font-bold tracking-wide">SPESA</span>
                        <span className="text-[11px] opacity-70 mt-1">aggiungi spesa</span>
                    </button>
                </div>

                {/* ────────────────────────────────────
                 * Categoria dinamica — Picker fullscreen
                 * ──────────────────────────────────── */}
                <div className="relative mt-4">
                    <label htmlFor="transaction-category" className="block text-sm font-medium mb-1">
                        Categoria
                    </label>

                    {/* Fake select */}
                    <button
                        type="button"
                        id="transaction-category"
                        onClick={openCategoryPicker}
                        disabled={loadingCategories || disabled}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition",
                            "bg-bg text-text focus:ring-2 focus:ring-primary/40",
                            errors.category_id ? "border-danger" : "border-border"
                        )}
                    >
                        <span className={formData.category_id ? "" : "text-muted-foreground"}>
                            {loadingCategories
                                ? "Caricamento..."
                                : formData.category_id
                                ? filteredCategories.find((c) => c.id === formData.category_id)?.name ?? "Categoria"
                                : "Seleziona categoria"}
                        </span>
                        <span className="opacity-60 text-xs">▼</span>
                    </button>

                    {errors.category_id && <p className="text-danger text-xs mt-1">{errors.category_id}</p>}

                    {/* Overlay fullscreen + picker centrale */}
                    {showCategoryPicker && (
                        <div
                            className="
                                fixed inset-0 z-[999] 
                                bg-black/40 backdrop-blur-md 
                                flex items-center justify-center
                                animate-fadeIn
                            "
                            onClick={(e) => {
                                e.stopPropagation(); // blocca la propagazione verso il Dialog
                                closeCategoryPicker(); // chiude SOLO il picker
                            }}
                        >
                            <div
                                className="
                                    bg-bg-elevate border border-border rounded-2xl 
                                    p-4 max-w-md w-[90%] max-h-[75vh] overflow-auto 
                                    shadow-2xl 
                                "
                                onClick={(e) => e.stopPropagation()} // blocca la chiusura quando clicchi dentro
                            >
                                <h3 className="text-center mb-3 font-semibold text-text">Seleziona una categoria</h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {filteredCategories.map((cat) => {
                                        const isActive = formData.category_id === cat.id;

                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                style={getCategoryStyle(cat as any, isActive)}
                                                className={cn(
                                                    "rounded-xl border px-3 py-3 flex flex-col items-center justify-center gap-2",
                                                    "transition-all duration-200",
                                                    isActive
                                                        ? "scale-[1.03] text-white"
                                                        : "hover:scale-[1.02] text-muted-foreground hover:text-text"
                                                )}
                                                onClick={() => {
                                                    setFormData({ ...formData, category_id: cat.id });
                                                    closeCategoryPicker(); // chiude SOLO picker
                                                }}
                                            >
                                                <div className="flex items-center justify-center text-3xl">
                                                    {getCategoryIcon(cat as any)}
                                                </div>
                                                <span className="text-xs text-center">{cat.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    className="mt-4 w-full py-2 text-sm rounded-xl border border-border text-text hover:bg-bg-soft transition"
                                    onClick={closeCategoryPicker}
                                >
                                    Chiudi
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ────────────────────────────────────
                 * Descrizione
                 * ──────────────────────────────────── */}
                <div className="mt-4">
                    <label htmlFor="transaction-description" className="block text-sm font-medium mb-1">
                        Descrizione
                    </label>
                    <Input
                        id="transaction-description"
                        name="description"
                        type="text"
                        placeholder="Descrizione"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={cn(errors.description ? "border-danger" : "")}
                    />
                    {errors.description && <p className="text-danger text-xs -mt-2">{errors.description}</p>}
                </div>

                {/* ────────────────────────────────────
                 * Importo + Data sulla stessa riga
                 * ──────────────────────────────────── */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    {/* Importo */}
                    <div className="sm:w-1/2">
                        <label htmlFor="transaction-amount" className="block text-sm font-medium mb-1">
                            Importo
                        </label>
                        <Input
                            id="transaction-amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="Importo"
                            value={formData.amount === 0 ? "" : formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: Number(e.target.value) || 0,
                                })
                            }
                            className={cn(errors.amount ? "border-danger" : "")}
                        />
                        {errors.amount && <p className="text-danger text-xs -mt-2">{errors.amount}</p>}
                    </div>

                    {/* Data */}
                    <div className="sm:w-1/2">
                        <label htmlFor="transaction-date" className="block text-sm font-medium mb-1">
                            Data
                        </label>
                        <Input
                            id="transaction-date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* ────────────────────────────────────
                 * Note
                 * ──────────────────────────────────── */}
                <div className="mt-4">
                    <label htmlFor="transaction-notes" className="block text-sm font-medium mb-1">
                        Note (opzionale)
                    </label>
                    <Textarea
                        id="transaction-notes"
                        name="notes"
                        placeholder="Note (opzionale)"
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                {/* ────────────────────────────────────
                 * Azioni — dinamiche per colore tipo
                 * ──────────────────────────────────── */}
                <div className="flex gap-2 w-full mt-6">
                    {/* Bottone ANNULLA (stile neutro) */}
                    <button
                        type="button"
                        className="
                            w-1/2 bg-bg-elevate text-text border border-bg-soft 
                            rounded-xl py-2 font-semibold shadow 
                            focus:ring-2 focus:ring-primary/40 transition
                        "
                        onClick={onCancel}
                        disabled={loading || disabled}
                    >
                        Annulla
                    </button>

                    {/* Bottone CONFERMA — colore dinamico */}
                    <button
                        type="submit"
                        className={cn(
                            "w-1/2 rounded-xl py-2 font-semibold shadow transition text-white focus:ring-2",
                            formData.type === "entrata"
                                ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/40"
                                : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/40"
                        )}
                        disabled={loading || disabled}
                    >
                        {loading
                            ? "Salvataggio…"
                            : transaction
                            ? formData.type === "entrata"
                                ? "Salva entrata"
                                : "Salva spesa"
                            : formData.type === "entrata"
                            ? "Crea entrata"
                            : "Crea spesa"}
                    </button>
                </div>
            </div>
        </form>
    );
}

// ───────────────────────────────────────────────────────────────
// Descrizione file:
// Questo componente React/Next.js gestisce il form di creazione/modifica
// di una transazione. Mantiene lo stato locale dei campi, filtra le
// categorie in base al tipo (entrata/spesa), mostra un toggle tipo,
// offre un picker categoria fullscreen con icone e colori da DB, valida
// i dati in submit e notifica il parent tramite onSave e onChangeForm.
// ───────────────────────────────────────────────────────────────
