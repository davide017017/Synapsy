"use client";

// =========================================
// LoadingOverlay.tsx — Overlay caricamento per modali
// =========================================

import { ReactNode } from "react";

// Props tipizzate: messaggio, icona, visibilità
type Props = {
    show: boolean;
    icon?: ReactNode; // icona custom (es: 💸, 🔄, 🏷️)
    message?: string; // messaggio principale
    subMessage?: React.ReactNode; // messaggio secondario
    colorClass?: string; // colore opzionale per icona
};

export default function LoadingOverlay({
    show,
    icon = "🔄",
    message = "Caricamento in corso…",
    subMessage = "Attendi un istante!",
    colorClass = "text-4xl",
}: Props) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 rounded-2xl">
            <span className={`${colorClass} animate-bounce mb-3`}>{icon}</span>
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
            </span>
        </div>
    );
}

// =========================================
