"use client";

/* ╔══════════════════════════════════════════════════════╗
 * ║   NewTransactionForm — Form creazione/modifica Tx   ║
 * ╚══════════════════════════════════════════════════════╝ */

import { useState, useMemo, useEffect } from "react";
import type { CSSProperties } from "react";
import { TransactionBase } from "@/types";
import type { NewTransactionFormProps } from "@/types";
import { useCategories } from "@/context/CategoriesContext";
import { useTransactions } from "@/context/TransactionsContext";
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
    onDelete,
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
        type: initialType || "spesa",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // ────────────────────────────────────────────────
    // Accent UI entrata/spesa
    // ────────────────────────────────────────────────
    const typeAccent = formData.type === "entrata" ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";

    const typeAccentSoft = formData.type === "entrata" ? "hsl(var(--c-success) / 0.12)" : "hsl(var(--c-danger) / 0.12)";

    const typeAccentBorder =
        formData.type === "entrata" ? "hsl(var(--c-success) / 0.35)" : "hsl(var(--c-danger) / 0.35)";

    // ────────────────────────────────────────────────
    // Context categorie + transazioni (per ordinamento per frequenza)
    // ────────────────────────────────────────────────
    const { categories, loading: loadingCategories } = useCategories();
    const { transactions } = useTransactions();

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
                category_id: transaction.category_id ?? transaction.category?.id,
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
    // Conta utilizzi per categoria (tutte le transazioni)
    // ────────────────────────────────────────────────
    const categoryUsageCount = useMemo(() => {
        const counts: Record<number, number> = {};
        for (const tx of transactions) {
            const id = tx.category_id ?? tx.category?.id;
            if (id) counts[id] = (counts[id] ?? 0) + 1;
        }
        return counts;
    }, [transactions]);

    // ────────────────────────────────────────────────
    // Top 5 descrizioni più frequenti per tipo corrente
    // ────────────────────────────────────────────────
    const topDescriptions = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const tx of transactions) {
            if (tx.type !== formData.type) continue;
            const desc = tx.description?.trim();
            if (desc) counts[desc] = (counts[desc] ?? 0) + 1;
        }
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([label, count]) => ({ label, count }));
    }, [transactions, formData.type]);

    // ────────────────────────────────────────────────
    // Filtra categorie per tipo corrente + ordina per frequenza d'uso
    // ────────────────────────────────────────────────
    const filteredCategories = useMemo(
        () =>
            categories
                .filter((cat) => cat.type === formData.type)
                .sort((a, b) => (categoryUsageCount[b.id] ?? 0) - (categoryUsageCount[a.id] ?? 0)),
        [categories, formData.type, categoryUsageCount],
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

    // ────────────────────────────────────────────────
    // Reset form ai valori originali (solo edit mode)
    // ────────────────────────────────────────────────
    const handleReset = () => {
        if (!transaction) return;
        setFormData({
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date.split("T")[0],
            category_id: transaction.category_id ?? transaction.category?.id,
            notes: transaction.notes || "",
            type: transaction.type,
        });
        setErrors({});
    };

    // ╔═══════════════════════════════╗
    // ║          RENDER FORM          ║
    // ╚═══════════════════════════════╝
    return (
        <form onSubmit={handleSubmit} className="space-y-4 pb-2 font-mono" autoComplete="off">
            {" "}
            <div
                className="
                    rounded-2xl
                    border
                    bg-black/25
                    backdrop-blur-sm
                    px-3 py-3
                    sm:px-4 sm:py-4
                    pb-safe
                "
                style={{
                    borderColor: typeAccentBorder,
                    boxShadow: `0 0 18px ${
                        formData.type === "entrata" ? "hsl(var(--c-success) / 0.10)" : "hsl(var(--c-danger) / 0.10)"
                    }`,
                }}
            >
                {/* ────────────────────────────────────
                 * Toggle tipo (Entrata / Spesa)
                 * ──────────────────────────────────── */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                type: "entrata",
                                category_id: 0,
                            })
                        }
                        className="
                            flex-1
                            flex flex-col items-center justify-center
                            rounded-xl
                            border
                            px-4 py-3
                            font-mono
                            uppercase
                            transition-all duration-200
                            active:scale-95
                        "
                        style={{
                            borderColor:
                                formData.type === "entrata"
                                    ? "hsl(var(--c-success) / 0.55)"
                                    : "hsl(var(--c-success) / 0.18)",
                            background:
                                formData.type === "entrata" ? "hsl(var(--c-success) / 0.12)" : "rgba(255,255,255,0.03)",
                            color:
                                formData.type === "entrata" ? "hsl(var(--c-success))" : "hsl(var(--c-success) / 0.55)",
                            boxShadow:
                                formData.type === "entrata" ? "0 0 16px hsl(var(--c-success) / 0.18)" : undefined,
                        }}
                    >
                        <span className="text-sm font-bold tracking-[0.12em]">Entrata</span>
                        <span className="text-[10px] opacity-60 mt-1 tracking-[0.08em]">aggiungi entrata</span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                type: "spesa",
                                category_id: 0,
                            })
                        }
                        className="
                            flex-1
                            flex flex-col items-center justify-center
                            rounded-xl
                            border
                            px-4 py-3
                            font-mono
                            uppercase
                            transition-all duration-200
                            active:scale-95
                        "
                        style={{
                            borderColor:
                                formData.type === "spesa"
                                    ? "hsl(var(--c-danger) / 0.55)"
                                    : "hsl(var(--c-danger) / 0.18)",
                            background:
                                formData.type === "spesa" ? "hsl(var(--c-danger) / 0.12)" : "rgba(255,255,255,0.03)",
                            color: formData.type === "spesa" ? "hsl(var(--c-danger))" : "hsl(var(--c-danger) / 0.55)",
                            boxShadow: formData.type === "spesa" ? "0 0 16px hsl(var(--c-danger) / 0.18)" : undefined,
                        }}
                    >
                        <span className="text-sm font-bold tracking-[0.12em]">Spesa</span>
                        <span className="text-[10px] opacity-60 mt-1 tracking-[0.08em]">aggiungi spesa</span>
                    </button>
                </div>

                {/* ────────────────────────────────────
                 * Categoria dinamica — Picker fullscreen
                 * ──────────────────────────────────── */}
                <div className="relative mt-2 md:mt-4">
                    <label
                        htmlFor="transaction-category"
                        className="
                        block mb-1
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-foreground/45
                    "
                    >
                        Categoria
                    </label>

                    {/* Fake select */}
                    <button
                        type="button"
                        id="transaction-category"
                        onClick={openCategoryPicker}
                        disabled={loadingCategories || disabled}
                        className="
                          w-full
                          flex items-center justify-between
                          px-3 py-2
                          rounded-xl
                          border
                          bg-black/20
                          text-sm
                          text-foreground
                          transition-all duration-200
                          focus:ring-2
                      "
                        style={{
                            borderColor: errors.category_id ? "hsl(var(--c-danger))" : typeAccentBorder,
                            boxShadow: `0 0 0 1px ${
                                errors.category_id ? "hsl(var(--c-danger) / 0.35)" : typeAccentBorder
                            }`,
                        }}
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
                                  max-w-md w-[90%]
                                  max-h-[75vh]
                                  overflow-auto
                                  rounded-2xl
                                  border border-white/10
                                  bg-black/80
                                  backdrop-blur-xl
                                  p-4
                                  shadow-[0_24px_80px_rgba(0,0,0,0.55)]
                              "
                                onClick={(e) => e.stopPropagation()} // blocca la chiusura quando clicchi dentro
                            >
                                <h3
                                    className="
                                      text-center mb-3
                                      font-mono
                                      text-xs
                                      font-bold
                                      uppercase
                                      tracking-[0.14em]
                                  "
                                    style={{ color: typeAccent }}
                                >
                                    Seleziona una categoria
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {filteredCategories.map((cat) => {
                                        const isActive = formData.category_id === cat.id;

                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                style={getCategoryStyle(cat as any, isActive)}
                                                className={cn(
                                                    "relative rounded-xl border px-3 py-3 flex flex-col items-center justify-center gap-2",
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

                                                {(categoryUsageCount[cat.id] ?? 0) > 0 && (
                                                    <span className="absolute  bottom-2 right-2 text-[10px] font-medium opacity-50 leading-none">
                                                        {categoryUsageCount[cat.id]}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    className="
                                      mt-4 w-full
                                      py-2
                                      rounded-xl
                                      border border-white/10
                                      bg-white/5
                                      font-mono
                                      text-[11px]
                                      uppercase
                                      tracking-[0.08em]
                                      text-foreground/60
                                      transition-all duration-200
                                      hover:bg-white/10
                                      hover:text-foreground
                                      active:scale-95
                                  "
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
                    <label
                        htmlFor="transaction-description"
                        className="
                          block mb-1
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          text-foreground/45
                      "
                    >
                        Descrizione
                    </label>
                    <Input
                        id="transaction-description"
                        name="description"
                        type="text"
                        placeholder="Descrizione"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={cn(
                            `
                            font-mono
                            bg-black/20
                            border
                            focus:ring-2
                        `,
                            errors.description ? "border-danger" : "",
                        )}
                        style={{
                            borderColor: errors.description ? "hsl(var(--c-danger))" : typeAccentBorder,
                            boxShadow: `0 0 0 1px ${
                                errors.description ? "hsl(var(--c-danger) / 0.35)" : typeAccentBorder
                            }`,
                        }}
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
                 * Quick description picks (top 5 dinamiche)
                 * ──────────────────────────────────── */}

                {topDescriptions.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                        {topDescriptions.map(({ label, count }) => {
                            const active = formData.description === label;

                            return (
                                <button
                                    key={label}
                                    type="button"
                                    className="
                                        relative
                                        flex flex-col items-center justify-center
                                        gap-0.5
                                        px-2 py-2
                                        rounded-xl
                                        border
                                        font-mono
                                        transition-all duration-200
                                        active:scale-95
                                    "
                                    style={{
                                        borderColor: active ? typeAccentBorder : "rgba(255,255,255,0.10)",
                                        background: active ? typeAccentSoft : "rgba(255,255,255,0.04)",
                                        color: active ? typeAccent : "hsl(var(--c-foreground) / 0.55)",
                                        boxShadow: active
                                            ? `0 0 12px ${
                                                  formData.type === "entrata"
                                                      ? "hsl(var(--c-success) / 0.18)"
                                                      : "hsl(var(--c-danger) / 0.18)"
                                              }`
                                            : undefined,
                                    }}
                                    onClick={() =>
                                        setFormData((p) => ({
                                            ...p,
                                            description: label,
                                        }))
                                    }
                                    aria-label={`Imposta descrizione: ${label}`}
                                >
                                    <span className="text-[10px] leading-tight text-center line-clamp-2 max-w-[64px]">
                                        {label}
                                    </span>
                                    {count > 0 && (
                                        <span className="absolute bottom-0 right-2 text-[10px] font-medium opacity-50 leading-none">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

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
                                  block mb-1
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.12em]
                                  text-foreground/45
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
                                      border bg-bg-elevate  font-semibold
                                      flex items-center justify-center 
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
                                    <span className="text-2xl font-bold leading-none">+</span>
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
                                      border bg-bg-elevate  
                                      flex items-center justify-center 
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
                                    <span className="text-2xl font-bold leading-none">−</span>
                                </button>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                {/* + */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-sm
                                      transition-all duration-150
                                      flex items-center justify-center 

                                      hover:border-sky-400/60
                                      hover:shadow-[0_0_10px_rgba(56,189,248,0.25)]

                                      active:bg-sky-400/20
                                      active:shadow-[inset_0_0_10px_rgba(56,189,248,0.35)]
                                    "
                                    onClick={() => applyAmountDelta(1)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 1"
                                >
                                    <span className="text-base font-semibold leading-none">+</span>
                                </button>

                                {/* STEP INDICATOR — VALORE (€) */}
                                <div
                                    className="
                                    flex items-center justify-center 
                                    gap-1
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
                                      flex items-center justify-center 

                                      hover:border-sky-400/60
                                      hover:shadow-[0_0_10px_rgba(56,189,248,0.25)]

                                      active:bg-sky-400/20
                                      active:shadow-[inset_0_0_10px_rgba(56,189,248,0.35)]
                                    "
                                    onClick={() => applyAmountDelta(-1)}
                                    disabled={loading || disabled}
                                    aria-label="Diminuisci di 1"
                                >
                                    <span className="text-base font-semibold leading-none">−</span>
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
                                    const n = parseAmount(formData.amount as any);
                                    setFormData((p) => ({
                                        ...p,
                                        amount: clampMin(roundTo(n, AMOUNT_DECIMALS), AMOUNT_MIN) as any,
                                    }));
                                }}
                                className={cn(
                                    `
                                        text-center
                                        font-mono
                                        font-bold
                                        tracking-wide
                                        bg-black/20
                                        border
                                        focus:ring-2
                                        !text-4xl sm:!text-2xl
                                    `,
                                    errors.amount ? "border-danger" : "",
                                )}
                                style={{
                                    borderColor: errors.amount ? "hsl(var(--c-danger))" : typeAccentBorder,
                                    boxShadow: `0 0 0 1px ${
                                        errors.amount ? "hsl(var(--c-danger) / 0.35)" : typeAccentBorder
                                    }`,
                                }}
                            />

                            <div className="flex flex-col items-center gap-1">
                                {/* + */}
                                <button
                                    type="button"
                                    className="
                                      h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-base font-semibold
                                      transition-all duration-150
                                      flex items-center justify-center 

                                      hover:border-amber-400/60
                                      hover:shadow-[0_0_10px_rgba(251,191,36,0.25)]

                                      active:bg-stone-400/20
                                      active:shadow-[inset_0_0_10px_rgba(168,162,158,0.35)]

                                    "
                                    onClick={() => applyAmountDelta(0.1)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 0.1"
                                >
                                    <span className="text-base font-semibold leading-none">+</span>
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
                                      flex items-center justify-center 

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
                                      flex items-center justify-center 

                                    hover:border-amber-700/70
                                    hover:shadow-[0_0_10px_rgba(180,83,9,0.35)]

                                    active:bg-amber-700/25
                                    active:shadow-[inset_0_0_10px_rgba(180,83,9,0.45)]

        "
                                    onClick={() => applyAmountDelta(0.01)}
                                    disabled={loading || disabled}
                                    aria-label="Aumenta di 0.01"
                                >
                                    <span className="text-sm font-medium leading-none">+</span>
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
                                      flex items-center justify-center 

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
                                        className="
                                            px-2.5 py-1
                                            rounded-full
                                            border
                                            font-mono
                                            text-xs
                                            font-medium
                                            transition-all duration-200
                                            active:scale-95
                                        "
                                        style={{
                                            borderColor: isActive ? typeAccentBorder : "rgba(255,255,255,0.10)",
                                            background: isActive ? typeAccentSoft : "rgba(255,255,255,0.04)",
                                            color: isActive ? typeAccent : "hsl(var(--c-foreground) / 0.55)",
                                            boxShadow: isActive
                                                ? `0 0 10px ${
                                                      formData.type === "entrata"
                                                          ? "hsl(var(--c-success) / 0.18)"
                                                          : "hsl(var(--c-danger) / 0.18)"
                                                  }`
                                                : undefined,
                                        }}
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
                                className="
                                  block mb-1
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.12em]
                                  text-foreground/45
                              "
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
                                    pl-12
                                    text-center
                                    font-mono
                                    bg-black/20
                                    border
                                    focus:ring-2
                                    [appearance:none]
                                "
                                style={{
                                    borderColor: typeAccentBorder,
                                    boxShadow: `0 0 0 1px ${typeAccentBorder}`,
                                }}
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
                                        className="
                                            px-1 py-2 sm:py-3
                                            rounded-2xl
                                            border
                                            font-mono
                                            text-xs sm:text-sm
                                            transition-all duration-200
                                            flex flex-col items-center
                                            active:scale-95
                                        "
                                        style={{
                                            borderColor: active ? typeAccentBorder : "rgba(255,255,255,0.10)",
                                            background: active ? typeAccentSoft : "rgba(255,255,255,0.04)",
                                            color: active ? typeAccent : "hsl(var(--c-foreground) / 0.55)",
                                            boxShadow: active
                                                ? `0 0 12px ${
                                                      formData.type === "entrata"
                                                          ? "hsl(var(--c-success) / 0.18)"
                                                          : "hsl(var(--c-danger) / 0.18)"
                                                  }`
                                                : undefined,
                                        }}
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
                            <label
                                htmlFor="transaction-notes"
                                className="
                                  block mb-1
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.12em]
                                  text-foreground/45
                              "
                            >
                                Note (opzionale)
                            </label>

                            <Textarea
                                id="transaction-notes"
                                name="notes"
                                placeholder="Note (opzionale)"
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="
                                    min-h-[120px]
                                    lg:min-h-[140px]
                                    break-words
                                    whitespace-pre-wrap
                                    font-mono
                                    bg-black/20
                                    border
                                    focus:ring-2
                                    placeholder:text-foreground/30
                                "
                                style={{
                                    borderColor: typeAccentBorder,
                                    boxShadow: `0 0 0 1px ${typeAccentBorder}`,
                                }}
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
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    py-2
                                    font-mono
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    transition-all duration-200
                                    active:scale-95
                                    focus:ring-2
                                    flex items-center justify-center
                                "
                                style={{
                                    background: typeAccentSoft,
                                    borderColor: typeAccentBorder,
                                    color: typeAccent,
                                    boxShadow: `0 0 16px ${
                                        formData.type === "entrata"
                                            ? "hsl(var(--c-success) / 0.20)"
                                            : "hsl(var(--c-danger) / 0.20)"
                                    }`,
                                }}
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
                                  w-full
                                  rounded-xl
                                  border border-white/10
                                  bg-white/5
                                  py-2
                                  font-mono
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.08em]
                                  text-foreground/60
                                  transition-all duration-200
                                  hover:bg-white/10
                                  hover:text-foreground
                                  active:scale-95
                                  flex items-center justify-center
                              "
                                onClick={onCancel}
                                disabled={loading || disabled}
                            >
                                Annulla
                            </button>

                            {/* Bottone RESET — solo in edit mode */}
                            {!!transaction && (
                                <button
                                    type="button"
                                    className="
                                      w-full
                                      rounded-xl
                                      border border-yellow-400/35
                                      bg-yellow-400/10
                                      py-2
                                      font-mono
                                      text-[11px]
                                      font-bold
                                      uppercase
                                      tracking-[0.08em]
                                      text-yellow-400
                                      transition-all duration-200
                                      hover:bg-yellow-400/15
                                      hover:shadow-[0_0_14px_rgba(250,204,21,0.20)]
                                      active:scale-95
                                      flex items-center justify-center gap-1
                                  "
                                    onClick={handleReset}
                                    disabled={loading || disabled}
                                    title="Ripristina i valori originali"
                                >
                                    <FiRotateCcw size={15} />
                                    Reset
                                </button>
                            )}

                            {/* Bottone ELIMINA — solo se onDelete è definito */}
                            {!!onDelete && (
                                <button
                                    type="button"
                                    className="
                                        w-full
                                        rounded-xl
                                        border border-danger/35
                                        bg-danger/10
                                        py-2
                                        font-mono
                                        text-[11px]
                                        font-bold
                                        uppercase
                                        tracking-[0.08em]
                                        text-danger
                                        transition-all duration-200
                                        hover:bg-danger/15
                                        hover:shadow-[0_0_14px_hsl(var(--c-danger)/0.20)]
                                        active:scale-95
                                        flex items-center justify-center
                                    "
                                    onClick={onDelete}
                                    disabled={loading || disabled}
                                >
                                    Elimina
                                </button>
                            )}
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
