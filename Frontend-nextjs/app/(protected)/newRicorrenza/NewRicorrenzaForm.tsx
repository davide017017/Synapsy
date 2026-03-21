"use client";

// ╔═══════════════════════════════════════════════════════╗
// ║    NewRicorrenzaForm.tsx — Form Create/Edit (UX/UI)  ║
// ╚═══════════════════════════════════════════════════════╝

import { useState, useMemo, useEffect } from "react";
import type { CSSProperties } from "react";
import { RicorrenzaBase } from "@/types/models/ricorrenza";
import type { NewRicorrenzaFormProps } from "@/types";
import { useCategories } from "@/context/CategoriesContext";
import type { Category } from "@/types/models/category";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { FiRotateCcw } from "react-icons/fi";
import type { IconType } from "react-icons";
import { getIconComponent } from "@/utils/categoryOptions";

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
    if (!cat.icon) return <span className="text-2xl">{cat.type === "entrata" ? "⬆️" : "⬇️"}</span>;
    return <Icon className="text-3xl" />;
}

// ────────────────────────────────────────────────
// Utility: aggiunge alpha a un colore hex #RRGGBB
// ────────────────────────────────────────────────
function withAlpha(hex: string | undefined, alphaHex: string) {
    if (!hex) return undefined;
    if (!hex.startsWith("#") || hex.length !== 7) return hex;
    return hex + alphaHex;
}

// ────────────────────────────────────────────────
// Stile card categoria basato sul colore da DB
// ────────────────────────────────────────────────
function getCategoryStyle(cat: { color?: string; type: "entrata" | "spesa" }, isActive: boolean): CSSProperties {
    const fallback = cat.type === "entrata" ? "#22c55e" : "#ef4444";
    const base = cat.color || fallback;
    return {
        background: `linear-gradient(135deg, ${withAlpha(base, "20")}, ${withAlpha(base, "08")})`,
        borderColor: withAlpha(base, isActive ? "AA" : "55"),
        boxShadow: isActive
            ? `0 0 18px ${withAlpha(base, "55")}, inset 0 0 18px ${withAlpha(base, "33")}`
            : `inset 0 0 14px ${withAlpha(base, "22")}`,
    };
}

// ===== Helper: formatta data per input type="date" =====
function toDateInputValue(dateString?: string) {
    if (!dateString) return new Date().toISOString().split("T")[0];
    const d = new Date(dateString);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

// ────────────────────────────────────────────────
// Amount helpers (stepper ±10/±1/±0.1/±0.01)
// ────────────────────────────────────────────────
const AMOUNT_DECIMALS = 2;
const AMOUNT_MIN = 0;
const QUICK_AMOUNTS = [9.99, 29.99, 50, 100];

function roundTo(n: number, decimals: number) {
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
}

function clampMin(n: number, min: number) {
    return Math.max(min, n);
}

function parseAmount(raw: string | number) {
    if (typeof raw === "number") return raw;
    const s = String(raw ?? "").trim().replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
}

// ────────────────────────────────────────────────
// Date helpers UI (dd/MM per quick buttons)
// ────────────────────────────────────────────────
const fmtDDMM = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" });

function toISODate(d: Date) {
    return d.toISOString().split("T")[0];
}

function formatDDMM(d: Date) {
    return fmtDDMM.format(d);
}

// ╔═══════════════════════════════════════════════════════╗
// ║              COMPONENTE PRINCIPALE                   ║
// ╚═══════════════════════════════════════════════════════╝
export default function NewRicorrenzaForm({
    onSave,
    onCancel,
    initialValues,
    onChangeForm,
    categoryPickerOpen,
    onCategoryPickerOpenChange,
}: NewRicorrenzaFormProps) {
    const { categories, loading: loadingCategories } = useCategories();

    // ==================== STATE ====================
    const [formData, setFormData] = useState<RicorrenzaBase>({
        nome: initialValues?.nome || "",
        importo: initialValues?.importo || 0,
        frequenza: initialValues?.frequenza || "monthly",
        prossima: toDateInputValue(initialValues?.prossima),
        category_id: initialValues?.category_id ?? (initialValues as any)?.category?.id ?? 0,
        notes: initialValues?.notes || "",
        type: initialValues?.type || "entrata",
        is_active: initialValues?.is_active ?? true,
        interval: initialValues?.interval || 1,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // ==================== PICKER STATE ====================
    const showCategoryPicker = categoryPickerOpen ?? false;
    const openCategoryPicker = () => onCategoryPickerOpenChange?.(true);
    const closeCategoryPicker = () => onCategoryPickerOpenChange?.(false);

    // ==================== RESET ANIMATIONS ====================
    const [isResetImportoAnimating, setIsResetImportoAnimating] = useState(false);
    const [isResetDataAnimating, setIsResetDataAnimating] = useState(false);

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (initialValues) {
            setFormData((prev) => ({
                ...prev,
                ...initialValues,
                prossima: toDateInputValue(initialValues.prossima),
                importo: initialValues.importo ?? 0,
                is_active: initialValues.is_active ?? true,
                interval: initialValues.interval ?? 1,
                category_id: initialValues.category_id ?? (initialValues as any)?.category?.id ?? 0,
            }));
        }
    }, [initialValues]);

    useEffect(() => {
        if (onChangeForm) onChangeForm(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    // ==================== CATEGORY FILTER ====================
    const filteredCategories = useMemo(
        () => categories.filter((cat: Category) => cat.type === formData.type),
        [categories, formData.type]
    );

    // ==================== DATE QUICK PICKS ====================
    const d0 = new Date();
    const d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    const d7 = new Date();
    d7.setDate(d7.getDate() + 7);
    const d30 = new Date();
    d30.setDate(d30.getDate() + 30);

    // ==================== AMOUNT HELPERS ====================
    const applyAmountDelta = (delta: number) => {
        setFormData((p) => {
            const current = parseAmount(p.importo as any);
            const next = clampMin(roundTo(current + delta, AMOUNT_DECIMALS), AMOUNT_MIN);
            return { ...p, importo: next };
        });
    };

    const handleResetImporto = () => {
        if (isResetImportoAnimating) return;
        setFormData((p) => ({ ...p, importo: 0 }));
        setIsResetImportoAnimating(true);
        setTimeout(() => setIsResetImportoAnimating(false), 1300);
    };

    const handleResetData = () => {
        if (isResetDataAnimating) return;
        setFormData((p) => ({ ...p, prossima: toDateInputValue() }));
        setIsResetDataAnimating(true);
        setTimeout(() => setIsResetDataAnimating(false), 1300);
    };

    // ==================== HANDLERS ====================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!formData.nome.trim()) errs.nome = "Il nome è obbligatorio";
        if (!formData.importo || isNaN(formData.importo) || Number(formData.importo) <= 0)
            errs.importo = "L'importo deve essere maggiore di 0";
        if (!formData.prossima) errs.prossima = "La data è obbligatoria";
        if (!formData.category_id) errs.category_id = "Seleziona una categoria";
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    // ==================== RESET (solo edit mode) ====================
    const handleReset = () => {
        if (!initialValues) return;
        setFormData({
            nome: initialValues.nome || "",
            importo: initialValues.importo ?? 0,
            frequenza: initialValues.frequenza || "monthly",
            prossima: toDateInputValue(initialValues.prossima),
            category_id: initialValues.category_id ?? (initialValues as any)?.category?.id ?? 0,
            notes: initialValues.notes || "",
            type: initialValues.type || "entrata",
            is_active: initialValues.is_active ?? true,
            interval: initialValues.interval ?? 1,
        });
        setErrors({});
    };

    // ╔═══════════════════════════════════════════════════════╗
    // ║                      RENDER FORM                     ║
    // ╚═══════════════════════════════════════════════════════╝
    return (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* ── STEP 1: Bordo colorato entrata/spesa ── */}
            <div
                className={cn(
                    "rounded-2xl border transition-colors pb-safe",
                    "px-3 py-3 sm:px-4 sm:py-4",
                    formData.type === "entrata" ? "border-emerald-500/80" : "border-rose-500/80"
                )}
            >
                {/* ===== Tipo ricorrenza ===== */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: "entrata", category_id: 0 })}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center rounded-xl border px-4 py-3 transition",
                            formData.type === "entrata"
                                ? "border-emerald-500 text-emerald-400 shadow"
                                : "border-border text-muted-foreground hover:border-emerald-500/60 hover:text-emerald-300/90"
                        )}
                    >
                        <span className="text-base font-bold tracking-wide">ENTRATA</span>
                        <span className="text-[11px] opacity-70 mt-1">ricorrenza in entrata</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: "spesa", category_id: 0 })}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center rounded-xl border px-4 py-3 transition",
                            formData.type === "spesa"
                                ? "border-rose-500 text-rose-400 shadow"
                                : "border-border text-muted-foreground hover:border-rose-500/60 hover:text-rose-300/90"
                        )}
                    >
                        <span className="text-base font-bold tracking-wide">SPESA</span>
                        <span className="text-[11px] opacity-70 mt-1">ricorrenza in uscita</span>
                    </button>
                </div>

                {/* ── STEP 6: Categoria — Picker fullscreen ── */}
                <div className="relative mt-2 md:mt-4">
                    <label htmlFor="ricorrenza-category" className="block text-sm font-medium mb-1">
                        Categoria
                    </label>

                    {/* Fake select button */}
                    <button
                        type="button"
                        id="ricorrenza-category"
                        onClick={openCategoryPicker}
                        disabled={loadingCategories}
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
                                  ? (filteredCategories.find((c) => c.id === formData.category_id)?.name ?? "Categoria")
                                  : "Seleziona categoria"}
                        </span>
                        <span className="opacity-60 text-xs">▼</span>
                    </button>

                    {errors.category_id && <p className="text-danger text-xs mt-1">{errors.category_id}</p>}

                    {/* Overlay fullscreen + picker centrale */}
                    {showCategoryPicker && (
                        <div
                            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-md flex items-center justify-center animate-fadeIn"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeCategoryPicker();
                            }}
                        >
                            <div
                                className="bg-bg-elevate border border-border rounded-2xl p-4 max-w-md w-[90%] max-h-[75vh] overflow-auto shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
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
                                                    closeCategoryPicker();
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

                {/* ===== Nome ===== */}
                <div className="mt-2 md:mt-4">
                    <label htmlFor="ricorrenza-nome" className="block text-sm font-medium mb-1">
                        Nome ricorrenza
                    </label>
                    <Input
                        id="ricorrenza-nome"
                        name="nome"
                        type="text"
                        placeholder="Nome ricorrenza"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className={errors.nome ? "border-danger" : ""}
                        autoComplete="off"
                    />
                    {errors.nome && <p className="text-danger text-xs mt-1">{errors.nome}</p>}
                </div>

                {/* ── STEP 5: Importo — Stepper ±10/±1/±0.1/±0.01 ── */}
                <div className="mt-2 md:mt-4">
                    <div className="relative flex items-center mb-1">
                        <button
                            type="button"
                            onClick={handleResetImporto}
                            aria-label="Reset importo"
                            className={cn(
                                "group flex items-center justify-center h-9 w-9 rounded-full border transition-all duration-300",
                                isResetImportoAnimating
                                    ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_16px_rgba(250,204,21,0.55)]"
                                    : "border-border hover:border-yellow-400/60 hover:shadow-[0_0_10px_rgba(250,204,21,0.25)]"
                            )}
                        >
                            <FiRotateCcw
                                size={16}
                                strokeWidth={2}
                                className={cn(
                                    "transition-transform",
                                    isResetImportoAnimating ? "animate-spin-slow" : "group-hover:rotate-[-20deg]"
                                )}
                            />
                        </button>
                        <label
                            htmlFor="ricorrenza-importo"
                            className="absolute left-1/2 -translate-x-1/2 text-base sm:text-lg font-semibold tracking-wider uppercase opacity-80 pointer-events-none"
                        >
                            Importo
                        </label>
                    </div>

                    <div className="flex items-stretch gap-1 sm:gap-2">
                        {/* ±10 — orange */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate font-semibold flex items-center justify-center transition-all duration-150 hover:border-orange-500/70 hover:shadow-[0_0_10px_rgba(249,115,22,0.35)] active:bg-orange-500/25 active:shadow-[inset_0_0_10px_rgba(249,115,22,0.45)]"
                                onClick={() => applyAmountDelta(10)}
                                disabled={loading}
                                aria-label="Aumenta di 10"
                            >
                                <span className="text-2xl font-bold leading-none">+</span>
                            </button>
                            <div className="flex items-center px-2 py-0.5 text-[11px] font-semibold border border-yellow-400/40 text-yellow-400 bg-yellow-400/10 select-none" aria-hidden="true">
                                10&nbsp;€
                            </div>
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-b-full rounded-t-none border bg-bg-elevate flex items-center justify-center transition-all duration-150 hover:border-orange-500/70 hover:shadow-[0_0_10px_rgba(249,115,22,0.35)] active:bg-orange-500/25 active:shadow-[inset_0_0_10px_rgba(249,115,22,0.45)]"
                                onClick={() => applyAmountDelta(-10)}
                                disabled={loading}
                                aria-label="Diminuisci di 10"
                            >
                                <span className="text-2xl font-bold leading-none">−</span>
                            </button>
                        </div>

                        {/* ±1 — sky */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-sm flex items-center justify-center transition-all duration-150 hover:border-sky-400/60 hover:shadow-[0_0_10px_rgba(56,189,248,0.25)] active:bg-sky-400/20 active:shadow-[inset_0_0_10px_rgba(56,189,248,0.35)]"
                                onClick={() => applyAmountDelta(1)}
                                disabled={loading}
                                aria-label="Aumenta di 1"
                            >
                                <span className="text-base font-semibold leading-none">+</span>
                            </button>
                            <div className="flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold border border-yellow-400/40 text-yellow-400 bg-yellow-400/10 select-none" aria-hidden="true">
                                1&nbsp;€
                            </div>
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-b-full rounded-t-none border bg-bg-elevate text-sm flex items-center justify-center transition-all duration-150 hover:border-sky-400/60 hover:shadow-[0_0_10px_rgba(56,189,248,0.25)] active:bg-sky-400/20 active:shadow-[inset_0_0_10px_rgba(56,189,248,0.35)]"
                                onClick={() => applyAmountDelta(-1)}
                                disabled={loading}
                                aria-label="Diminuisci di 1"
                            >
                                <span className="text-base font-semibold leading-none">−</span>
                            </button>
                        </div>

                        {/* Input importo centrale */}
                        <Input
                            id="ricorrenza-importo"
                            name="importo"
                            type="text"
                            inputMode="decimal"
                            placeholder="€"
                            value={String(formData.importo === 0 ? "" : formData.importo)}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (!/^[0-9.,]*$/.test(v)) return;
                                setFormData((p) => ({ ...p, importo: v as any }));
                            }}
                            onBlur={() => {
                                const n = parseAmount(formData.importo as any);
                                setFormData((p) => ({ ...p, importo: clampMin(roundTo(n, AMOUNT_DECIMALS), AMOUNT_MIN) }));
                            }}
                            className={cn(
                                "text-center font-bold tracking-wide",
                                "!text-4xl sm:!text-2xl",
                                errors.importo ? "border-danger" : ""
                            )}
                        />

                        {/* ±0.1 — amber */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-base font-semibold flex items-center justify-center transition-all duration-150 hover:border-amber-400/60 hover:shadow-[0_0_10px_rgba(251,191,36,0.25)] active:bg-stone-400/20 active:shadow-[inset_0_0_10px_rgba(168,162,158,0.35)]"
                                onClick={() => applyAmountDelta(0.1)}
                                disabled={loading}
                                aria-label="Aumenta di 0.1"
                            >
                                <span className="text-base font-semibold leading-none">+</span>
                            </button>
                            <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold border border-yellow-400/40 text-yellow-400 bg-yellow-400/10 select-none" aria-hidden="true">
                                0.1&nbsp;€
                            </div>
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-b-full rounded-t-none border bg-bg-elevate text-base font-semibold flex items-center justify-center transition-all duration-150 hover:border-amber-400/60 hover:shadow-[0_0_10px_rgba(251,191,36,0.25)] active:bg-stone-400/20 active:shadow-[inset_0_0_10px_rgba(168,162,158,0.35)]"
                                onClick={() => applyAmountDelta(-0.1)}
                                disabled={loading}
                                aria-label="Diminuisci di 0.1"
                            >
                                −
                            </button>
                        </div>

                        {/* ±0.01 — amber dark */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-t-full rounded-b-none border bg-bg-elevate text-xs font-semibold flex items-center justify-center transition-all duration-150 hover:border-amber-700/70 hover:shadow-[0_0_10px_rgba(180,83,9,0.35)] active:bg-amber-700/25 active:shadow-[inset_0_0_10px_rgba(180,83,9,0.45)]"
                                onClick={() => applyAmountDelta(0.01)}
                                disabled={loading}
                                aria-label="Aumenta di 0.01"
                            >
                                <span className="text-sm font-medium leading-none">+</span>
                            </button>
                            <div className="flex items-center px-2 py-0.5 text-[10px] font-semibold border border-yellow-500/40 text-yellow-500 bg-yellow-500/10 select-none" aria-hidden="true">
                                0.01&nbsp;€
                            </div>
                            <button
                                type="button"
                                className="h-10 w-7 sm:h-11 sm:w-10 rounded-b-full rounded-t-none border bg-bg-elevate text-xs font-semibold flex items-center justify-center transition-all duration-150 hover:border-amber-700/70 hover:shadow-[0_0_10px_rgba(180,83,9,0.35)] active:bg-amber-700/25 active:shadow-[inset_0_0_10px_rgba(180,83,9,0.45)]"
                                onClick={() => applyAmountDelta(-0.01)}
                                disabled={loading}
                                aria-label="Diminuisci di 0.01"
                            >
                                −
                            </button>
                        </div>
                    </div>

                    {errors.importo && <p className="text-danger text-xs mt-1">{errors.importo}</p>}

                    {/* Quick amounts */}
                    <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
                        {QUICK_AMOUNTS.map((v) => {
                            const isActive = Number(formData.importo) === v;
                            return (
                                <button
                                    key={v}
                                    type="button"
                                    className={cn(
                                        "px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-150",
                                        isActive
                                            ? "border-primary bg-primary/30 text-primary shadow-[0_0_8px_rgba(56,189,248,0.45)]"
                                            : "border-border/50 bg-transparent text-muted-foreground hover:bg-primary/15 hover:border-primary/60 hover:text-text"
                                    )}
                                    onClick={() => setFormData({ ...formData, importo: v })}
                                    disabled={loading}
                                >
                                    € {v}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── STEP 2: Frequenza — pill buttons ── */}
                <div className="mt-2 md:mt-4">
                    <label className="block text-sm font-medium mb-2">Frequenza</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(
                            [
                                { value: "daily", label: "Giornaliera" },
                                { value: "weekly", label: "Settimanale" },
                                { value: "monthly", label: "Mensile" },
                                { value: "annually", label: "Annuale" },
                            ] as const
                        ).map(({ value, label }) => {
                            const isActive = formData.frequenza === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, frequenza: value })}
                                    className={cn(
                                        "flex flex-col items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-150",
                                        isActive
                                            ? formData.type === "entrata"
                                                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow"
                                                : "border-rose-500 text-rose-400 bg-rose-500/10 shadow"
                                            : "border-border/50 text-muted-foreground bg-bg-elevate hover:border-primary/50 hover:text-text"
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── STEP 3: Data prossima + quick picks + reset ── */}
                <div className="mt-2 md:mt-4">
                    <div className="relative flex items-center mb-1">
                        <button
                            type="button"
                            onClick={handleResetData}
                            aria-label="Reset data prossima"
                            className={cn(
                                "group flex items-center justify-center h-9 w-9 rounded-full border transition-all duration-300",
                                isResetDataAnimating
                                    ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_16px_rgba(250,204,21,0.55)]"
                                    : "border-border hover:border-yellow-400/60 hover:shadow-[0_0_10px_rgba(250,204,21,0.25)]"
                            )}
                        >
                            <FiRotateCcw
                                size={16}
                                strokeWidth={2}
                                className={cn(
                                    "transition-transform",
                                    isResetDataAnimating ? "animate-spin-slow" : "group-hover:rotate-[-20deg]"
                                )}
                            />
                        </button>
                        <label
                            htmlFor="ricorrenza-prossima"
                            className="absolute left-1/2 -translate-x-1/2 text-sm font-medium pointer-events-none"
                        >
                            Data prossima
                        </label>
                    </div>

                    <Input
                        id="ricorrenza-prossima"
                        name="prossima"
                        type="date"
                        value={formData.prossima}
                        onChange={(e) => setFormData({ ...formData, prossima: e.target.value })}
                        className={errors.prossima ? "border-danger" : ""}
                    />
                    {errors.prossima && <p className="text-danger text-xs mt-1">{errors.prossima}</p>}

                    {/* Quick date picks (future) */}
                    <div className="mt-2 grid grid-cols-4 gap-2">
                        {[
                            { label: "Oggi", date: toISODate(d0), ddmm: formatDDMM(d0) },
                            { label: "Domani", date: toISODate(d1), ddmm: formatDDMM(d1) },
                            { label: "+7 gg", date: toISODate(d7), ddmm: formatDDMM(d7) },
                            { label: "+30 gg", date: toISODate(d30), ddmm: formatDDMM(d30) },
                        ].map((item) => {
                            const active = formData.prossima === item.date;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    className={cn(
                                        "px-1 py-2 sm:py-3 rounded-2xl border text-xs sm:text-sm transition-all duration-150 flex flex-col items-center",
                                        active
                                            ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                                            : "bg-bg-elevate text-muted-foreground border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-text"
                                    )}
                                    onClick={() => setFormData((p) => ({ ...p, prossima: item.date }))}
                                    disabled={loading}
                                >
                                    <span className="block leading-tight">{item.label}</span>
                                    <span className="block text-[11px] opacity-70 leading-tight mt-0.5">{item.ddmm}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── STEP 4: Note + Azioni (flex row) ── */}
                <div className="mt-4">
                    <div className="flex gap-3 lg:gap-6">
                        {/* Note (sinistra) */}
                        <div className="flex-1 min-w-0">
                            <label htmlFor="ricorrenza-notes" className="block text-sm font-medium mb-1">
                                Note (opzionale)
                            </label>
                            <Textarea
                                id="ricorrenza-notes"
                                name="notes"
                                placeholder="Note (opzionale)"
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="min-h-[120px] lg:min-h-[140px] break-words whitespace-pre-wrap"
                            />
                        </div>

                        {/* Bottoni (destra) */}
                        <div className="w-[140px] sm:w-[170px] lg:w-[220px] flex flex-col gap-2 items-center justify-center">
                            {/* Crea / Salva */}
                            <button
                                type="submit"
                                className={cn(
                                    "w-full rounded-xl py-2 font-semibold shadow transition text-white focus:ring-2 flex items-center justify-center",
                                    formData.type === "entrata"
                                        ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/40"
                                        : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/40"
                                )}
                                disabled={loading}
                            >
                                {loading
                                    ? "Salvataggio..."
                                    : initialValues && initialValues.nome
                                      ? "Salva modifiche"
                                      : "Crea ricorrenza"}
                            </button>

                            {/* Annulla */}
                            <button
                                type="button"
                                className="w-full bg-bg-elevate text-text border border-bg-soft rounded-xl py-2 font-semibold shadow focus:ring-2 focus:ring-primary/40 transition flex items-center justify-center"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Annulla
                            </button>

                            {/* Reset — solo edit mode */}
                            {!!initialValues && (
                                <button
                                    type="button"
                                    className="w-full bg-bg-elevate text-warning border border-warning/40 rounded-xl py-2 font-semibold shadow hover:bg-warning/10 hover:border-warning/70 focus:ring-2 focus:ring-warning/40 transition flex items-center justify-center gap-1"
                                    onClick={handleReset}
                                    disabled={loading}
                                    title="Ripristina i valori originali"
                                >
                                    <FiRotateCcw size={15} />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
