"use client";

// ======================================================
// ModalLayout.tsx — Shell riutilizzabile per tutte le modali
// ======================================================

import { ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
    title?: ReactNode;
    onClose?: () => void;
    children: ReactNode;
    footer?: ReactNode;
    showClose?: boolean;
    className?: string;
};

export default function ModalLayout({ title, onClose, children, footer, showClose = true, className = "" }: Props) {
    return (
        <div
            className={`
                w-full max-w-lg
                rounded-2xl
                border border-modal
                shadow-2xl shadow-black/30
                backdrop-blur-[4px]
                text-modal-text
                p-4
                flex flex-col
                max-h-[80vh]
                ${className}
            `}
        >
            {/* Header: titolo e X */}
            {(title || showClose) && (
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-modal flex-shrink-0">
                    <div className="font-bold text-lg">{title}</div>
                    {showClose && onClose && (
                        <button
                            onClick={onClose}
                            className="hover:opacity-60 p-1 rounded-full transition"
                            title="Chiudi"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            )}

            {/* Corpo (body), scrollabile se serve */}
            <div className="overflow-y-auto p-2 flex-1">{children}</div>

            {/* Footer */}
            {footer && (
                <div className="pt-3 border-t border-modal mt-3 flex justify-end gap-2 flex-shrink-0">{footer}</div>
            )}
        </div>
    );
}
