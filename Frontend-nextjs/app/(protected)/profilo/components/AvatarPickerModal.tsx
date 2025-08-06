"use client";

// =====================================================
// AvatarPickerModal — selezione avatar, chiusura su click overlay
// =====================================================

import { useRef } from "react";
import AvatarSelector from "./AvatarSelector";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ----------- Props tipizzate -----------
type AvatarPickerModalProps = {
    selected: string;
    onSelect: (val: string) => void;
    onClose: () => void;
};

// =====================================================
// Componente principale
// =====================================================
export default function AvatarPickerModal({ selected, onSelect, onClose }: AvatarPickerModalProps) {
    // Ref per la finestra modale interna
    const modalRef = useRef<HTMLDivElement>(null);

    // Handler chiusura su click fuori dalla modale
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{
                    background: "hsl(var(--c-bg-glass, 230 12% 17% / 0.8))",
                    backdropFilter: "blur(6px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={handleOverlayClick} // ─── Chiusura su click overlay
            >
                {/* ================= MODALE ================= */}
                <motion.div
                    ref={modalRef}
                    className="relative w-full max-w-lg flex flex-col rounded-2xl shadow-xl"
                    style={{
                        background: "hsl(var(--c-bg-elevate, 230 17% 21%))",
                        border: "1.5px solid hsl(var(--c-primary-border, 159 68% 54% / 0.18))",
                        color: "hsl(var(--c-text, 220 60% 96%))",
                        boxShadow: "0 8px 40px 0 hsl(var(--c-primary-shadow, 159 68% 54% / 0.13))",
                    }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                >
                    {/* ===== HEADER ===== */}
                    <div className="flex items-center justify-between mb-2 px-5 pt-5">
                        <h2
                            className="text-lg font-bold tracking-tight"
                            style={{ color: "hsl(var(--c-primary, 159 68% 54%))" }}
                        >
                            Scegli il tuo avatar
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition"
                            title="Chiudi"
                        >
                            <X size={22} style={{ color: "hsl(var(--c-text-secondary, 220 12% 70%))" }} />
                        </button>
                    </div>
                    {/* ================= */}
                    {/* ===== AVATAR SELECTOR ===== */}
                    <div className="px-5 pb-2 pt-2">
                        <AvatarSelector selected={selected} onSelect={onSelect} />
                    </div>
                    {/* ================= */}
                    {/* ===== FOOTER ===== */}
                    <div className="flex justify-end px-5 pb-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl font-medium border border-primary/30"
                            style={{
                                background: "hsl(var(--c-primary-light, 159 89% 60%) / 0.08)",
                                color: "hsl(var(--c-primary, 159 68% 54%))",
                                borderColor: "hsl(var(--c-primary-border, 159 68% 54% / 0.18))",
                            }}
                        >
                            Chiudi
                        </button>
                    </div>
                    {/* ================= */}
                </motion.div>
                {/* ================= */}
            </motion.div>
        </AnimatePresence>
    );
}
