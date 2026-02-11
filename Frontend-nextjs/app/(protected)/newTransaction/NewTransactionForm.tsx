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
import type { IconType } from "react-icons";
import { getIconComponent } from "@/utils/categoryOptions";
import { FiRotateCcw } from "react-icons/fi";

// ────────────────────────────────────────────────
// Helper per classi dinamiche (accetta falsy)
// ────────────────────────────────────────────────
function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

// ────────────────────────────────────────────────
// Icona categoria (usa icon da DB, fallback su frecce)
// ────────────────────────────────────────────────
function getCategoryIcon(cat: { icon?: string; type: "entrata" | "spesa" }) {
    const Icon = getIconComponent(cat.icon as any) as IconType;

    // se non c’è icon in DB → fallback frecce
    if (!cat.icon) return <span className="text-2xl">{cat.type === "entrata" ? "⬆️" : "⬇️"}</span>;

    return <Icon className="text-3xl" />;
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
// ────────────────────────────────────────────────
// UI: messaggio errore con dismiss (X)
// ────────────────────────────────────────────────
function FieldError({ message, onClose }: { message?: string; onClose?: () => void }) {
    if (!message) return null;

    return (
        <div
            className="
                relative mt-2
                flex items-center justify-center
                text-sm font-medium
                text-rose-200
                bg-rose-500/10
                border border-rose-400/25
                rounded-xl
                px-4 py-2
            "
            role="alert"
        >
            <span className="text-center">{message}</span>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Chiudi errore"
                    className="
                        absolute right-2 top-1/2 -translate-y-1/2
                        h-6 w-6 rounded-full
                        flex items-center justify-center
                        text-rose-300
                        hover:text-rose-100
                        hover:bg-rose-500/20
                        transition
                    "
                >
                    ×
                </button>
            )}
        </div>
    );
}

/*
  File: NewTransactionForm.tsx
  Scopo: messaggio errore centrato e dismissibile
  Dipendenze: nessuna
  Note: la X rimuove solo l’errore UI
*/

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
    // Preset importi rapidi
    // ────────────────────────────────────────────────
    const QUICK_AMOUNTS = [4.8, 20, 50, 100];

    // ────────────────────────────────────────────────
    // Amount helpers (UX stepper: ±1 a sinistra, ±0.1 a destra)
    // ────────────────────────────────────────────────
    const AMOUNT_DECIMALS = 2;
    const AMOUNT_MIN = 0;

    function roundTo(n: number, decimals: number) {
        const f = Math.pow(10, decimals);
        return Math.round(n * f) / f;
    }

    function clampMin(n: number, min: number) {
        return Math.max(min, n);
    }

    function parseAmount(raw: string | number) {
        if (typeof raw === "number") return raw;
        const s = String(raw ?? "")
            .trim()
            .replace(",", ".");
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    }

    const applyAmountDelta = (delta: number) => {
        setFormData((p) => {
            const current = parseAmount(p.amount as any);
            const next = clampMin(roundTo(current + delta, AMOUNT_DECIMALS), AMOUNT_MIN);
            return { ...p, amount: next as any };
        });
    };

    // ────────────────────────────────────────────────
    // Reset helpers (amount/date)
    // ────────────────────────────────────────────────
    const getTodayISO = () => new Date().toISOString().split("T")[0];

    const resetAmount = () => setFormData((p) => ({ ...p, amount: 0 as any }));

    const resetDate = () =>
        setFormData((p) => ({
            ...p,
            date: (initialDate || getTodayISO()) as any,
        }));

    // ────────────────────────────────────────────────
    const dateInputId = "transaction-date";

    // ────────────────────────────────────────────────
    // Date helpers UI (dd/MM per quick buttons)
    // ────────────────────────────────────────────────
    const fmtDDMM = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" });

    function toISODate(d: Date) {
        return d.toISOString().split("T")[0];
    }

    function formatDDMM(d: Date) {
        return fmtDDMM.format(d); // es. 19/12
    }

    const d0 = new Date(); // oggi
    const d1 = new Date();
    d1.setDate(d1.getDate() - 1); // ieri
    const d2 = new Date();
    d2.setDate(d2.getDate() - 2); // altro ieri

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
        [categories, formData.type],
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

    const [isResetAmountAnimating, setIsResetAmountAnimating] = useState(false);
    const [isResetDateAnimating, setIsResetDateAnimating] = useState(false);

    const handleResetAmount = () => {
        if (isResetAmountAnimating) return;

        resetAmount();

        setIsResetAmountAnimating(true);
        setTimeout(() => {
            setIsResetAmountAnimating(false);
        }, 1300);
    };

    const handleResetDate = () => {
        if (isResetDateAnimating) return;

        resetDate();

        setIsResetDateAnimating(true);
        setTimeout(() => {
            setIsResetDateAnimating(false);
        }, 1300);
    };

    // ╔═══════════════════════════════╗
    // ║          RENDER FORM          ║
    // ╚═══════════════════════════════╝
    return (
        <form onSubmit={handleSubmit} className="space-y-4 pb-2" autoComplete="off">
            <div
                className={cn(
                    "rounded-2xl border transition-colors pb-safe",
                    "px-3 py-3 sm:px-4 sm:py-4", // 👈 QUI
                    formData.type === "entrata" ? "border-emerald-500/80" : "border-rose-500/80",
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
                                : "border-border text-muted-foreground hover:border-emerald-500/60 hover:text-emerald-300/90",
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
                                : "border-border text-muted-foreground hover:border-rose-500/60 hover:text-rose-300/90",
                        )}
                    >
                        <span className="text-base font-bold tracking-wide">SPESA</span>
                        <span className="text-[11px] opacity-70 mt-1">aggiungi spesa</span>
                    </button>
                </div>

                {/* ────────────────────────────────────
                 * Categoria dinamica — Picker fullscreen
                 * ──────────────────────────────────── */}
                <div className="relative mt-2 md:mt-4">
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
                            errors.category_id ? "border-danger" : "border-border",
                        )}
                    >
                        <span className={formData.category_id ? "" : "text-muted-foreground"}>
                            {loadingCategories
                                ? "Caricamento..."
                                : formData.category_id
                                  ? (filteredCategories.find((c) => c.id === formData.category_id)?.name ?? "Categoria")
                                  : "Seleziona categoria"}
                        </span>
                        <span className="opacity-60 text-xs">▼</span>
                    </button>

                    <FieldError
                        message={errors.category_id}
                        onClose={() =>
                            setErrors((e) => {
                                const { category_id, ...rest } = e;
                                return rest;
                            })
                        }
                    />

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
                                                        : "hover:scale-[1.02] text-muted-foreground hover:text-text",
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
                <div className="mt-2 md:mt-4">
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
                    <FieldError
                        message={errors.description}
                        onClose={() =>
                            setErrors((e) => {
                                const { description, ...rest } = e;
                                return rest;
                            })
                        }
                    />
                </div>
                {/* ────────────────────────────────────
                 * Quick description picks
                 * ──────────────────────────────────── */}

                <div className="mt-3 grid grid-cols-5 gap-2">
                    {[
                        { key: "autostrada", label: "Autostrada", icon: "🚗" },
                        { key: "benzina", label: "Benzina", icon: "⛽" },
                        { key: "pellet", label: "Pellet", icon: "🔥" },
                        { key: "taglio", label: "Taglio", icon: "✂️" },
                        { key: "busta", label: "Busta", icon: "✉️" },
                    ].map((q) => {
                        const active = formData.description === q.label;

                        return (
                            <button
                                key={q.key}
                                type="button"
                                className={cn(
                                    `
                    flex flex-col items-center justify-center
                    gap-0.5
                    px-2 py-2
                    rounded-xl border
                    transition-all duration-150
                    transform
                    `,
                                    active
                                        ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(56,189,248,0.35)] scale-[1.03]"
                                        : `
                          bg-bg-elevate
                          text-muted-foreground
                          border-border/50
                          hover:text-text
                          hover:border-primary/50
                          hover:bg-primary/10
                        `,
                                )}
                                onClick={() =>
                                    setFormData((p) => ({
                                        ...p,
                                        description: q.label,
                                    }))
                                }
                                aria-label={`Imposta descrizione: ${q.label}`}
                            >
                                {/* Icona */}
                                <span className="text-xl leading-none">{q.icon}</span>

                                {/* Label sotto */}
                                <span className="text-[10px] leading-tight text-center truncate max-w-[64px]">
                                    {q.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ────────────────────────────────────
                 * Importo + Data sulla stessa riga (+ reset)
                 * ──────────────────────────────────── */}

                <div className="mt-4 grid grid-cols-1 gap-1 md:gap-2">
                    {/* Importo */}
                    <div className="w-full">
                        <div className="relative flex items-center mb-1">
                            <button
                                type="button"
                                onClick={handleResetAmount}
                                aria-label="Reset importo"
                                className={cn(
                                    `
                                    group flex items-center justify-center
                                    h-9 w-9 rounded-full
                                    border transition-all duration-300
                                    `,
                                    isResetAmountAnimating
                                        ? `
                                          border-yellow-400
                                          bg-yellow-400/20
                                          shadow-[0_0_16px_rgba(250,204,21,0.55)]
                                          `
                                        : `
                                          border-border
                                          hover:border-yellow-400/60
                                          hover:shadow-[0_0_10px_rgba(250,204,21,0.25)]
                                        `,
                                )}
                            >
                                <FiRotateCcw
                                    size={16}
                                    strokeWidth={2}
                                    className={cn(
                                        "transition-transform",
                                        isResetAmountAnimating ? "animate-spin-slow" : "group-hover:rotate-[-20deg]",
                                    )}
                                />
                            </button>

                            {/* Label IMPORTO — CENTRO reale */}
                            <label
                                htmlFor="transaction-amount"
                                className="
                                  absolute left-1/2 -translate-x-1/2
                                  text-base sm:text-lg
                                  font-semibold
                                  tracking-wider
                                  uppercase
                                  opacity-80
                                  pointer-events-none
                                "
                            >
                                Importo
                            </label>
                        </div>

                        {/* il tuo layout stepper verticale (quello che hai appena messo) */}
                        <div className="flex items-stretch gap-1 sm:gap-2 md:gap-2">
                            <div className="flex flex-col items-center gap-1">
                                {/* +10 */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10
                                      rounded-t-full rounded-b-none
                                      border bg-bg-elevate text-sm font-semibold
                                      transition-all duration-150

                                      hover:border-orange-500/70
                                      hover:shadow-[0_0_10px_rgba(249,115,22,0.35)]

                                      active:bg-orange-500/25
                                      active:shadow-[inset_0_0_10px_rgba(249,115,22,0.45)]
                                    "
                                    onClick={() => applyAmountDelta(10)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 10"
                                >
                                    +10
                                </button>

                                {/* STEP INDICATOR */}
                                <div
                                    className="
                                      flex items-center
                                      px-2 py-0.5
                                      text-[11px] font-semibold
                                      border border-yellow-400/40
                                      text-yellow-400
                                      bg-yellow-400/10

                                      select-none
                                    "
                                    aria-hidden="true"
                                >
                                    10&nbsp;€
                                </div>

                                {/* −10 */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10
                                      rounded-b-full rounded-t-none
                                      border bg-bg-elevate text-sm font-semibold
                                      transition-all duration-150

                                    hover:border-orange-500/70
                                    hover:shadow-[0_0_10px_rgba(249,115,22,0.35)]

                                    active:bg-orange-500/25
                                    active:shadow-[inset_0_0_10px_rgba(249,115,22,0.45)]

                                    "
                                    onClick={() => applyAmountDelta(-10)}
                                    disabled={loading || disabled}
                                    aria-label="Diminuisci di 10"
                                >
                                    −10
                                </button>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                {/* + */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-sm
                                      transition-all duration-150

                                      hover:border-sky-400/60
                                      hover:shadow-[0_0_10px_rgba(56,189,248,0.25)]

                                      active:bg-sky-400/20
                                      active:shadow-[inset_0_0_10px_rgba(56,189,248,0.35)]
                                    "
                                    onClick={() => applyAmountDelta(1)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 1"
                                >
                                    +
                                </button>

                                {/* STEP INDICATOR — VALORE (€) */}
                                <div
                                    className="
                                    flex items-center gap-1
                                    px-2 py-0.5 
                                    text-[11px] font-semibold

                                    border border-yellow-400/40
                                    text-yellow-400
                                    bg-yellow-400/10
                                    
                                    select-none
                                  "
                                    aria-hidden="true"
                                >
                                    <span>1&nbsp;€</span>
                                </div>

                                {/* − */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10 rounded-b-full rounded-t-none border bg-bg-elevate text-sm
                                      transition-all duration-150

                                      hover:border-sky-400/60
                                      hover:shadow-[0_0_10px_rgba(56,189,248,0.25)]

                                      active:bg-sky-400/20
                                      active:shadow-[inset_0_0_10px_rgba(56,189,248,0.35)]
                                    "
                                    onClick={() => applyAmountDelta(-1)}
                                    disabled={loading || disabled}
                                    aria-label="Diminuisci di 1"
                                >
                                    −
                                </button>
                            </div>

                            <Input
                                id="transaction-amount"
                                name="amount"
                                type="text"
                                inputMode="decimal"
                                placeholder="€"
                                value={String(formData.amount ?? "")}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (!/^[0-9.,]*$/.test(v)) return;
                                    setFormData((p) => ({ ...p, amount: v as any }));
                                }}
                                onBlur={() => {
                                    // NORMALIZZA solo quando l’utente finisce
                                    const n = parseAmount(formData.amount as any);
                                    setFormData((p) => ({
                                        ...p,
                                        amount: clampMin(roundTo(n, AMOUNT_DECIMALS), AMOUNT_MIN) as any,
                                    }));
                                }}
                                className={cn(
                                    "text-center font-bold tracking-wide",
                                    "!text-4xl sm:!text-2xl",
                                    errors.amount ? "border-danger" : "",
                                )}
                            />

                            <div className="flex flex-col items-center gap-1">
                                {/* + */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-base font-semibold
                                      transition-all duration-150

                                      hover:border-amber-400/60
                                      hover:shadow-[0_0_10px_rgba(251,191,36,0.25)]

                                      active:bg-stone-400/20
                                      active:shadow-[inset_0_0_10px_rgba(168,162,158,0.35)]

                                    "
                                    onClick={() => applyAmountDelta(0.1)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 0.1"
                                >
                                    +
                                </button>

                                {/* STEP INDICATOR — VALORE (€) */}
                                <div
                                    className="
                                    flex items-center gap-1
                                    px-2 py-0.5 
                                    text-[11px] font-semibold

                                    border border-yellow-400/40
                                    text-yellow-400
                                    bg-yellow-400/10
                                    
                                    select-none
                                  "
                                    aria-hidden="true"
                                >
                                    <span>0.1&nbsp;€</span>
                                </div>

                                {/* − */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10 rounded-b-full rounded-t-none border bg-bg-elevate text-base font-semibold
                                      transition-all duration-150

                                      hover:border-amber-400/60
                                      hover:shadow-[0_0_10px_rgba(251,191,36,0.25)]

                                      active:bg-stone-400/20
                                      active:shadow-[inset_0_0_10px_rgba(168,162,158,0.35)]
                                    "
                                    onClick={() => applyAmountDelta(-0.1)}
                                    disabled={loading || disabled}
                                    aria-label="Diminuisci di 0.1"
                                >
                                    −
                                </button>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                {/* +0.01 */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10
                                      rounded-t-full rounded-b-none
                                      border bg-bg-elevate text-xs font-semibold
                                      transition-all duration-150

                                    hover:border-amber-700/70
                                    hover:shadow-[0_0_10px_rgba(180,83,9,0.35)]

                                    active:bg-amber-700/25
                                    active:shadow-[inset_0_0_10px_rgba(180,83,9,0.45)]

        "
                                    onClick={() => applyAmountDelta(0.01)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 0.01"
                                >
                                    +
                                </button>

                                {/* STEP INDICATOR */}
                                <div
                                    className="
                                    flex items-center
                                    px-2 py-0.5
                                    text-[10px] font-semibold
                                    border border-yellow-500/40
                                    text-yellow-500
                                    bg-yellow-500/10
                                    select-none
                                  "
                                    aria-hidden="true"
                                >
                                    0.01&nbsp;€
                                </div>

                                {/* −0.01 */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10
                                      rounded-b-full rounded-t-none
                                      border bg-bg-elevate text-xs font-semibold
                                      transition-all duration-150

                                    hover:border-amber-700/70
                                      hover:shadow-[0_0_10px_rgba(180,83,9,0.35)]

                                    active:bg-amber-700/25
                                      active:shadow-[inset_0_0_10px_rgba(180,83,9,0.45)]
                                      "
                                    onClick={() => applyAmountDelta(-0.01)}
                                    disabled={loading || disabled}
                                    aria-label="Diminuisci di 0.01"
                                >
                                    −
                                </button>
                            </div>
                        </div>

                        <FieldError
                            message={errors.amount}
                            onClose={() =>
                                setErrors((e) => {
                                    const { amount, ...rest } = e;
                                    return rest;
                                })
                            }
                        />
                    </div>

                    {/* ────────────────────────────────────
                     * Importi rapidi (quick pick)
                     * ──────────────────────────────────── */}
                    <div className="mt-2">
                        <div className="flex flex-wrap gap-2 items-center justify-center">
                            {QUICK_AMOUNTS.map((v) => {
                                const isActive = Number(formData.amount) === v;

                                return (
                                    <button
                                        key={v}
                                        type="button"
                                        className={cn(
                                            "px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-150",
                                            isActive
                                                ? "border-primary bg-primary/30 text-primary shadow-[0_0_8px_rgba(56,189,248,0.45)]"
                                                : "border-border/50 bg-transparent text-muted-foreground hover:bg-primary/15 hover:border-primary/60 hover:text-text",
                                        )}
                                        onClick={() => setFormData({ ...formData, amount: v })}
                                        disabled={loading || disabled}
                                    >
                                        € {v}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Data */}
                    <div className="w-full">
                        <div className="relative flex items-center mb-1">
                            {/* Label centro */}
                            <label
                                htmlFor={dateInputId}
                                className="absolute left-1/2 -translate-x-1/2 text-sm font-medium pointer-events-none"
                            >
                                Data
                            </label>

                            {/* Reset  */}
                            <button
                                type="button"
                                className={cn(
                                    `
                                    group flex items-center justify-center
                                    h-9 w-9 rounded-full
                                    border transition-all duration-300
                                    `,
                                    isResetDateAnimating
                                        ? `
                                    border-yellow-400
                                    bg-yellow-400/20
                                    shadow-[0_0_16px_rgba(250,204,21,0.55)]
                                    `
                                        : `
                                    border-border
                                    hover:border-yellow-400/60
                                    hover:shadow-[0_0_10px_rgba(250,204,21,0.25)]
                                  `,
                                )}
                                onClick={handleResetDate}
                                disabled={loading || disabled}
                                aria-label="Reset data"
                                title="Reset data"
                            >
                                <FiRotateCcw
                                    size={16}
                                    strokeWidth={2}
                                    className={cn(
                                        "transition-transform",
                                        isResetDateAnimating ? "animate-spin-slow" : "group-hover:rotate-[-20deg]",
                                    )}
                                />
                            </button>
                        </div>

                        <div className="relative mx-auto w-full sm:max-w-[220px]">
                            {/* Bottone calendario */}
                            <button
                                type="button"
                                className="
                                  absolute left-2 top-1/2 -translate-y-1/2
                                  h-8 w-8 rounded-full
                                  border border-border
                                  text-muted-foreground
                                  hover:text-text hover:border-sky-400/60
                                  hover:shadow-[0_0_8px_rgba(56,189,248,0.25)]
                                  active:bg-sky-400/15
                                  transition
                                "
                                onClick={() => {
                                    const el = document.getElementById(dateInputId) as HTMLInputElement | null;
                                    // @ts-ignore
                                    el?.showPicker ? el.showPicker() : el?.focus();
                                }}
                                aria-label="Apri calendario"
                            >
                                📅
                            </button>

                            {/* Input */}
                            <Input
                                id={dateInputId}
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="
                                w-full
                                pl-12   /* spazio per icona */
                                text-center
                                [appearance:none]
                              "
                            />
                        </div>

                        {/* Quick date picks */}
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {[
                                { label: "Altro ieri", date: toISODate(d2), ddmm: formatDDMM(d2) },
                                { label: "Ieri", date: toISODate(d1), ddmm: formatDDMM(d1) },
                                { label: "Oggi", date: toISODate(d0), ddmm: formatDDMM(d0) },
                            ].map((item) => {
                                const active = formData.date === item.date;

                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className={cn(
                                            `
                                            px-1 py-2 sm:py-3
                                            rounded-2xl border
                                            text-xs sm:text-sm
                                            transition-all duration-150
                                            flex flex-col items-center
                                            `,
                                            active
                                                ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                                                : "bg-bg-elevate text-muted-foreground border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-text",
                                        )}
                                        onClick={() => setFormData((p) => ({ ...p, date: item.date }))}
                                        disabled={loading || disabled}
                                    >
                                        <span className="block leading-tight">{item.label}</span>
                                        <span className="block text-[11px] opacity-70 leading-tight mt-0.5">
                                            {item.ddmm}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ────────────────────────────────────
                 * NOTE + AZIONI (responsive)
                 *  - xs/md: note a sinistra + bottoni in colonna a destra
                 *  - lg+:   stessa idea ma più spazio, bottoni centrati nel box
                 * ──────────────────────────────────── */}
                <div className="mt-4">
                    <div className="flex gap-3 lg:gap-6">
                        {/* Note (sinistra) */}
                        <div className="flex-1 min-w-0">
                            <label htmlFor="transaction-notes" className="block text-sm font-medium mb-1">
                                Note (opzionale)
                            </label>

                            <Textarea
                                id="transaction-notes"
                                name="notes"
                                placeholder="Note (opzionale)"
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="min-h-[120px] lg:min-h-[140px] break-words whitespace-pre-wrap"
                            />
                        </div>

                        {/* Bottoni (destra) */}
                        <div
                            className="
                                w-[140px] sm:w-[170px] lg:w-[220px]
                                flex flex-col gap-2
                                items-center justify-center
                            "
                        >
                            {/* Bottone CREA/SALVA */}
                            <button
                                type="submit"
                                className={cn(
                                    "w-full rounded-xl py-2 font-semibold shadow transition text-white focus:ring-2",
                                    "flex items-center justify-center", // centra testo (orizzontale + verticale)
                                    formData.type === "entrata"
                                        ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/40"
                                        : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/40",
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

                            {/* Bottone ANNULLA */}
                            <button
                                type="button"
                                className="
                                    w-full bg-bg-elevate text-text border border-bg-soft 
                                    rounded-xl py-2 font-semibold shadow 
                                    focus:ring-2 focus:ring-primary/40 transition
                                    flex items-center justify-center  /* centra testo */
                                "
                                onClick={onCancel}
                                disabled={loading || disabled}
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

/*
  File: NewTransactionForm.tsx
  Scopo: form creazione/modifica transazioni con picker categoria, quick amounts e stepper importo (±1 / ±0.1)
  Dipendenze: CategoriesContext, Input, Textarea, getIconComponent
  Note: input importo custom (decimal) per UX migliore; rounding/clamp per evitare bug float
*/
