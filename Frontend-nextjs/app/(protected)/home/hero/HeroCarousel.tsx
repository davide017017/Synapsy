// app/(protected)/home/hero/HeroCarousel.tsx
"use client";

// ─────────────────────────────────────────
// Carosello hero home — versione semplificata
// Mostra UNA slide alla volta, niente track
// orizzontale a 300% di larghezza.
// ─────────────────────────────────────────

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import HeroWelcome from "./heroItems/HeroWelcome";
import HeroSaldo from "./heroItems/HeroSaldo";
import HeroSuggerimento from "./heroItems/HeroSuggerimento";

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export default function HeroCarousel() {
    // --- Slide con id stabili ---
    const slides = useMemo(
        () => [
            { id: "welcome", node: <HeroWelcome /> },
            { id: "saldo", node: <HeroSaldo /> },
            { id: "suggerimento", node: <HeroSuggerimento /> },
        ],
        [],
    );

    const [index, setIndex] = useState(0);
    const total = slides.length;

    const go = (n: number) => setIndex(((n % total) + total) % total);

    const current = slides[index];

    // --- Swipe orizzontale (mobile: le frecce sono nascoste) ---
    const touchX = useRef<number | null>(null);
    const onTouchStart = (e: React.TouchEvent) => {
        touchX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    };

    return (
        <div className="relative w-full max-w-full">
        <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="
        relative
        w-full max-w-full
        rounded-[14px] lg:rounded-3xl shadow-2xl
        bg-gradient-radial from-primary/40 via-primary-light/10 to-transparent
        lg:py-4
      "
        >
            {/* ───────────────────────────── */}
            {/* Stage: UNA sola slide alla volta */}
            {/* ───────────────────────────── */}
            <div
                className="
          relative
          w-full
          overflow-hidden
          rounded-[14px] lg:rounded-2xl
          h-[104px] lg:h-auto lg:min-h-[380px]
          flex items-center justify-center
        "
            >
                {/* wrapper interno: centra il contenuto */}
                <div className="w-full h-full flex items-center justify-center px-2 lg:px-4 lg:pt-2">
                    <div className="w-full max-w-xl">{current.node}</div>
                </div>
            </div>

            {/* ───────────────────────────── */}
            {/* Frecce di navigazione         */}
            {/* ───────────────────────────── */}
            <button
                onClick={() => go(index - 1)}
                aria-label="Precedente"
                className="
        hidden lg:block
        absolute
        left-4 top-[20%] -translate-y-1/2
        px-1.5 py-4
        rounded-xl
        border border-primary/35
        bg-background/35 hover:bg-primary/10
        text-primary
        shadow-[0_0_18px_rgba(20,184,138,0.18)]
        backdrop-blur-md
        transition-all duration-200
        hover:border-primary/70
        hover:shadow-[0_0_24px_rgba(20,184,138,0.32)]
        active:scale-95
    "
            >
                <ArrowLeft size={21} strokeWidth={1.8} />
            </button>

            <button
                onClick={() => go(index + 1)}
                aria-label="Successivo"
                className="
        hidden lg:block
        absolute
        right-4 top-[20%] -translate-y-1/2
        px-1.5 py-4
        rounded-xl
        border border-primary/35
        bg-background/35 hover:bg-primary/10
        text-primary
        shadow-[0_0_18px_rgba(20,184,138,0.18)]
        backdrop-blur-md
        transition-all duration-200
        hover:border-primary/70
        hover:shadow-[0_0_24px_rgba(20,184,138,0.32)]
        active:scale-95
    "
            >
                <ArrowRight size={21} strokeWidth={1.8} />
            </button>

            </div>

            {/* ───────────────────────────── */}
            {/* Indicatori (dots)             */}
            {/* mobile: sotto il box, attivo largo 14px */}
            {/* ───────────────────────────── */}
            <div
                className="
          mt-1.5 flex justify-center items-center gap-1
          lg:mt-0 lg:gap-2
          lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2
        "
            >
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setIndex(i)}
                        aria-label={`Vai a slide ${i + 1}`}
                        className={`
              h-[5px] rounded-full transition-all duration-300 lg:w-3 lg:h-3
              ${i === index ? "w-[14px] bg-primary lg:bg-white lg:shadow" : "w-[5px] bg-white/30"}
            `}
                    />
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Descrizione file
// ─────────────────────────────────────────────
// Cosa fa:
//   • Mostra il carosello della home (Welcome, Saldo, Suggerimento).
//   • Mostra UNA sola slide alla volta, con frecce e pallini per cambiare.
//
// Come lo fa:
//   • Usa un array di slide con id e nodo React e stato `index` per la slide corrente.
//   • Lo "stage" è un flex container con `items-center justify-center` per centrare la slide.
//   • Il wrapper interno ha `flex items-center justify-center` per centrare il contenuto
//     della slide sia orizzontalmente che verticalmente, entro `max-w-xl`.
//   • Non usa track a larghezza multipla, quindi non crea overflow orizzontale.
//   • Sotto lg (Home mobile): box alto 104px, frecce nascoste, swipe orizzontale
//     per cambiare slide e pallini sotto il box (attivo largo 14px).
// ─────────────────────────────────────────────
