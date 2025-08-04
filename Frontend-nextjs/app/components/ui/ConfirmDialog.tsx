"use client";
// =========================================
// components/ui/ConfirmDialog.tsx — Dialog conferma con icona watermark
// =========================================
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { ReactNode, isValidElement } from "react";

type ConfirmDialogType = "delete" | "confirm" | "info";
type Props = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    type?: ConfirmDialogType;
    title?: string;
    message?: ReactNode;
    highlight?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    icon?: ReactNode;
};

const typeDefaults = {
    delete: {
        icon: <AlertTriangle className="text-white drop-shadow" size={48} />,
        // Icône watermark bianca opaca, ben visibile su rosso
        bgIcon: (
            <AlertTriangle
                size={190}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none"
                style={{
                    color: "#fff", // bianco, ben visibile su rosso
                    filter: "blur(1.5px)",
                    // Alt: puoi provare "color: '#fff5f5'" per effetto più soft
                }}
                aria-hidden
            />
        ),
        title: "Conferma eliminazione",
        confirmLabel: "Sì, elimina",
        highlightClass: "text-white font-bold",
        cardBg: "bg-[rgb(239,68,68)]", // red-500 pieno
        border: "border-red-700",
        accentBtn: "bg-white text-red-700 hover:bg-red-50",
        accentText: "text-white",
        secondaryBtn: "bg-red-100 text-red-900 hover:bg-red-200",
    },
    confirm: {
        icon: <CheckCircle2 className="text-white drop-shadow" size={48} />,
        bgIcon: (
            <CheckCircle2
                size={190}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none"
                style={{
                    color: "#fff",
                    filter: "blur(1.5px)",
                }}
                aria-hidden
            />
        ),
        title: "Conferma azione",
        confirmLabel: "Conferma",
        highlightClass: "text-white font-bold",
        cardBg: "bg-[rgb(16,185,129)]", // emerald-500
        border: "border-emerald-700",
        accentBtn: "bg-white text-emerald-700 hover:bg-emerald-50",
        accentText: "text-white",
        secondaryBtn: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
    },
    info: {
        icon: <Info className="text-white drop-shadow" size={48} />,
        bgIcon: (
            <Info
                size={190}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none"
                style={{
                    color: "#fff",
                    filter: "blur(1.5px)",
                }}
                aria-hidden
            />
        ),
        title: "Attenzione",
        confirmLabel: "Ok",
        highlightClass: "text-white font-bold",
        cardBg: "bg-[rgb(37,99,235)]", // blue-600
        border: "border-blue-800",
        accentBtn: "bg-white text-blue-700 hover:bg-blue-50",
        accentText: "text-white",
        secondaryBtn: "bg-blue-100 text-blue-900 hover:bg-blue-200",
    },
} as const;

export default function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    loading = false,
    type = "delete",
    title,
    message,
    highlight,
    confirmLabel,
    cancelLabel = "Annulla",
    icon,
}: Props) {
    if (!open) return null;

    const defaults = typeDefaults[type];

    // Evidenziato
    const renderHighlight = (node: ReactNode) => {
        if (!node) return null;
        if (typeof node === "string" || typeof node === "number") {
            return <span className={`mb-1 text-center text-base ${defaults.highlightClass}`}>{node}</span>;
        }
        if (isValidElement(node)) {
            return <div className={`mb-1 text-center text-base ${defaults.highlightClass}`}>{node}</div>;
        }
        return node;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div
                className={`
                    relative overflow-hidden rounded-3xl shadow-2xl
                    p-8 max-w-xs w-full flex flex-col items-center
                    ${defaults.cardBg} ${defaults.border} border-2
                    transition-all
                `}
                style={{
                    boxShadow: "0 12px 48px 0 rgba(220,60,80,0.27), 0 2px 20px 0 rgba(40,40,60,0.13)",
                }}
            >
                {/* Icona watermark bianca di sfondo */}
                {defaults.bgIcon}

                {/* Icona in primo piano */}
                <div className="z-10 mb-2">{icon || defaults.icon}</div>

                {/* Titolo */}
                <div className={`text-xl font-bold text-center z-10 mb-2 ${defaults.accentText} drop-shadow`}>
                    {title || defaults.title}
                </div>

                {/* Messaggio */}
                {message && <div className="z-10 text-base text-center mb-2 text-white/90">{message}</div>}

                {/* Evidenziato */}
                {highlight && (
                    <div className="z-10 w-full flex flex-col items-center mb-2">{renderHighlight(highlight)}</div>
                )}

                {/* Pulsanti */}
                <div className="z-10 flex gap-4 mt-3 w-full justify-center">
                    <button
                        className={`px-6 py-2 rounded-xl font-semibold shadow transition ${defaults.accentBtn} disabled:opacity-70`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmLabel || defaults.confirmLabel}
                    </button>
                    <button
                        className={`px-6 py-2 rounded-xl font-semibold shadow ${defaults.secondaryBtn} transition`}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

