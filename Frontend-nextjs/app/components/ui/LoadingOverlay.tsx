"use client";

// =========================================
// LoadingOverlay.tsx — Overlay caricamento per modali/section/fullscreen
// =========================================

import { ReactNode } from "react";

// Tipi Props
type Props = {
    show: boolean;
    icon?: ReactNode; // Icona custom (es: <Loader2 />, "🔄", ecc)
    message?: string; // Messaggio principale
    subMessage?: React.ReactNode; // Messaggio secondario opzionale
    colorClass?: string; // Classe per icona principale
    fixed?: boolean; // Se true: overlay su tutto lo schermo
    rounded?: boolean; // Se true: overlay ha rounded (per modali)
};

export default function LoadingOverlay({
    show,
    icon = "🔄",
    message = "Caricamento in corso…",
    subMessage = "Attendi un istante!",
    colorClass = "text-4xl text-primary",
    fixed = false,
    rounded = true,
}: Props) {
    if (!show) return null;

    return (
        <div
            className={`
                ${fixed ? "fixed" : "absolute"}
                inset-0 z-50 flex flex-col items-center justify-center
                bg-black/70
                ${rounded ? "rounded-2xl" : ""}
                backdrop-blur-[2.5px]
            `}
        >
            <span className={`${colorClass} mb-3`}>{icon}</span>
            <span className="text-white font-semibold text-lg text-center">
                {message}
                <br />
                <span className="text-sm text-zinc-300 flex items-center gap-1">
                    {subMessage}
                    <span className="ml-2 flex space-x-1">
                        <span className="dot-pulse bg-zinc-300 rounded-full w-2 h-2 inline-block"></span>
                        <span className="dot-pulse bg-zinc-300 rounded-full w-2 h-2 inline-block"></span>
                        <span className="dot-pulse bg-zinc-300 rounded-full w-2 h-2 inline-block"></span>
                    </span>
                </span>
            </span>
            <style jsx>{`
                .dot-pulse {
                    animation: dotPulse 1.2s infinite;
                }
                .dot-pulse:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .dot-pulse:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes dotPulse {
                    0%,
                    80%,
                    100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    40% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
}

