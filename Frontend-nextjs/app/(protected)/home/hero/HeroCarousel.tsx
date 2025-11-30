// app/(protected)/home/hero/HeroCarousel.tsx
"use client";

// ─────────────────────────────────────────
// Carosello hero home — versione semplificata
// Mostra UNA slide alla volta, niente track
// orizzontale a 300% di larghezza.
// ─────────────────────────────────────────

import { useMemo, useState } from "react";
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
        []
    );

    const [index, setIndex] = useState(0);
    const total = slides.length;

    const go = (n: number) => setIndex(((n % total) + total) % total);

    const current = slides[index];

    return (
        <div
            className="
        relative
        w-full max-w-full
        rounded-3xl shadow-2xl
        bg-gradient-radial from-primary/40 via-primary-light/10 to-transparent
        py-4
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
          rounded-2xl
          min-h-[360px] sm:min-h-[380px]
          flex items-center justify-center
        "
            >
                {/* wrapper interno: centra il contenuto */}
                <div className="w-full h-full flex items-center justify-center px-2 sm:px-4 pt-1 sm:pt-2">
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
          absolute
          left-4 top-1/2 -translate-y-1/2
          p-2 rounded-full
          bg-white/20 hover:bg-white/30
          transition-colors
        "
            >
                <ArrowLeft size={22} />
            </button>

            <button
                onClick={() => go(index + 1)}
                aria-label="Successivo"
                className="
          absolute
          right-4 top-1/2 -translate-y-1/2
          p-2 rounded-full
          bg-white/20 hover:bg-white/30
          transition-colors
        "
            >
                <ArrowRight size={22} />
            </button>

            {/* ───────────────────────────── */}
            {/* Indicatori (dots)             */}
            {/* ───────────────────────────── */}
            <div
                className="
          absolute
          bottom-4 left-1/2 -translate-x-1/2
          flex space-x-2
        "
            >
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setIndex(i)}
                        aria-label={`Vai a slide ${i + 1}`}
                        className={`
              w-3 h-3 rounded-full
              ${i === index ? "bg-white shadow" : "bg-white/30"}
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
// ─────────────────────────────────────────────
