"use client";

// =====================================================
// AvatarPickerModal — carosello 5-view con animazione
// =====================================================

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAvatars } from "@/hooks/useAvatars";
import getAvatarUrl from "@/utils/avatar";

// ----------- Props -----------
type AvatarPickerModalProps = {
    selected: string;
    onSelect: (val: string) => void;
    onClose: () => void;
};

// ----------- Configurazione dimensioni per offset (-2…+2) -----------
type SizeConfig = { w: number; h: number; opacity: number; ring: boolean };

// Indice 0 = offset -2, indice 4 = offset +2
const SIZES: SizeConfig[] = [
    { w: 40, h: 40, opacity: 0.3, ring: false }, // offset -2
    { w: 64, h: 64, opacity: 0.7, ring: false }, // offset -1
    { w: 96, h: 96, opacity: 1.0, ring: true  }, // offset  0 (centro)
    { w: 64, h: 64, opacity: 0.7, ring: false }, // offset +1
    { w: 40, h: 40, opacity: 0.3, ring: false }, // offset +2
];

// ----------- Varianti animazione riga carosello -----------
const rowVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: -dir * 60, opacity: 0 }),
};

// =====================================================
// Componente principale
// =====================================================
export default function AvatarPickerModal({ selected, onSelect, onClose }: AvatarPickerModalProps) {
    const { avatars, loading } = useAvatars();
    const panelRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const initialized = useRef(false);

    // show: controlla l'animazione di uscita interna
    const [show, setShow] = useState(true);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Sincronizza l'indice con l'avatar selezionato al caricamento
    useEffect(() => {
        if (avatars.length && !initialized.current) {
            initialized.current = true;
            const found = avatars.findIndex((a) => a.src === selected);
            setIndex(found >= 0 ? found : 0);
        }
    }, [avatars, selected]);

    // ── Handlers ──────────────────────────────────────
    const triggerClose = () => setShow(false);

    const navigate = (dir: number) => {
        if (!avatars.length) return;
        setDirection(dir);
        setIndex((i) => (i + dir + avatars.length) % avatars.length);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
            triggerClose();
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) >= 50) navigate(dx < 0 ? 1 : -1);
        touchStartX.current = null;
    };

    const handleConfirm = () => {
        const avatar = avatars[index];
        if (avatar) {
            onSelect(avatar.src);
            triggerClose();
        }
    };

    // ── Dati visibili (5 slot) ──────────────────────
    const visible = avatars.length
        ? [-2, -1, 0, 1, 2].map((offset) => ({
              avatar: avatars[(index + offset + avatars.length) % avatars.length],
              offset,
              size: SIZES[offset + 2] as SizeConfig,
          }))
        : [];

    const currentAvatar = avatars[index];

    // ── Render ──────────────────────────────────────
    return (
        // AnimatePresence interno: gestisce enter/exit in autonomia
        // onExitComplete chiama onClose dopo la fine dell'animazione
        <AnimatePresence onExitComplete={onClose}>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleOverlayClick}
                >
                    {/* ========== PANNELLO ========== */}
                    <motion.div
                        ref={panelRef}
                        className="relative w-full max-w-sm flex flex-col rounded-2xl shadow-xl"
                        style={{
                            background: "hsl(var(--c-bg-elevate, 230 17% 21%))",
                            border: "1.5px solid hsl(var(--c-primary-border, 159 68% 54% / 0.18))",
                            color: "hsl(var(--c-text, 220 60% 96%))",
                            maxHeight: "90vh",
                            boxShadow: "0 8px 40px 0 hsl(var(--c-primary-shadow, 159 68% 54% / 0.13))",
                        }}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    >
                        {/* ===== HEADER ===== */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h2
                                className="text-lg font-bold tracking-tight"
                                style={{ color: "hsl(var(--c-primary, 159 68% 54%))" }}
                            >
                                Scegli il tuo avatar
                            </h2>
                            <button
                                type="button"
                                onClick={triggerClose}
                                className="p-2 -mr-2 rounded-full hover:bg-white/10 transition"
                                title="Chiudi"
                            >
                                <X size={20} style={{ color: "hsl(var(--c-text-secondary, 220 12% 70%))" }} />
                            </button>
                        </div>

                        {/* ===== BODY ===== */}
                        <div
                            className="flex flex-col items-center gap-4 px-4 pb-5 pt-1"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {loading ? (
                                <p className="py-8 text-sm opacity-60 text-center">Caricamento...</p>
                            ) : (
                                <>
                                    {/* ── Riga: freccia + carosello + freccia ── */}
                                    <div className="flex items-center gap-1 w-full">
                                        {/* Freccia sinistra */}
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/10 transition"
                                            aria-label="Avatar precedente"
                                        >
                                            <ChevronLeft
                                                size={22}
                                                style={{ color: "hsl(var(--c-text-secondary, 220 12% 70%))" }}
                                            />
                                        </button>

                                        {/* Viewport carosello: overflow-hidden ritaglia i ±2 */}
                                        <div
                                            className="relative flex-1 overflow-hidden flex items-center justify-center"
                                            style={{ height: 112 }}
                                        >
                                            <AnimatePresence initial={false} custom={direction}>
                                                <motion.div
                                                    key={index}
                                                    custom={direction}
                                                    variants={rowVariants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 320,
                                                        damping: 32,
                                                    }}
                                                    className="absolute flex items-center justify-center gap-2"
                                                >
                                                    {visible.map(({ avatar, offset, size }) => (
                                                        <button
                                                            key={avatar.id}
                                                            type="button"
                                                            onClick={() =>
                                                                offset !== 0 && navigate(offset > 0 ? 1 : -1)
                                                            }
                                                            className="rounded-full overflow-hidden flex-shrink-0"
                                                            style={{
                                                                width: size.w,
                                                                height: size.h,
                                                                opacity: size.opacity,
                                                                border: size.ring
                                                                    ? "2px solid hsl(var(--c-primary, 159 68% 54%))"
                                                                    : "2px solid transparent",
                                                                boxShadow: size.ring
                                                                    ? "0 0 0 3px hsl(var(--c-primary, 159 68% 54%) / 0.25)"
                                                                    : "none",
                                                                cursor: offset === 0 ? "default" : "pointer",
                                                                transition: "opacity 0.2s, box-shadow 0.2s",
                                                            }}
                                                        >
                                                            <Image
                                                                src={getAvatarUrl({ avatarUrl: avatar.src })}
                                                                alt={avatar.label}
                                                                width={size.w}
                                                                height={size.h}
                                                                className="object-cover"
                                                                style={{ width: size.w, height: size.h }}
                                                            />
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        {/* Freccia destra */}
                                        <button
                                            type="button"
                                            onClick={() => navigate(1)}
                                            className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/10 transition"
                                            aria-label="Avatar successivo"
                                        >
                                            <ChevronRight
                                                size={22}
                                                style={{ color: "hsl(var(--c-text-secondary, 220 12% 70%))" }}
                                            />
                                        </button>
                                    </div>

                                    {/* ── Label avatar corrente ── */}
                                    <p className="text-sm text-center opacity-70 min-h-[1.25rem]">
                                        {currentAvatar?.label ?? ""}
                                    </p>

                                    {/* ── Bottone conferma ── */}
                                    <button
                                        type="button"
                                        onClick={handleConfirm}
                                        className="w-full px-5 py-2.5 rounded-xl font-semibold transition hover:brightness-110 active:scale-[0.98]"
                                        style={{
                                            background: "hsl(var(--c-primary, 159 68% 54%))",
                                            color: "hsl(var(--c-bg, 230 17% 14%))",
                                        }}
                                    >
                                        Scegli questo avatar
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                    {/* ============================= */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
