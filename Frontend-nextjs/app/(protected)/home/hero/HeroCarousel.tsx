// app/(protected)/home/hero/HeroCarousel.tsx
"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import HeroWelcome from "./heroItems/HeroWelcome";
import HeroSaldo from "./heroItems/HeroSaldo";
import HeroSuggerimento from "./heroItems/HeroSuggerimento";

export default function HeroCarousel() {
    // Elenco slide con id stabili
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

    return (
        <div
            className="
                relative w-full max-w-3xl mx-auto
                rounded-3xl shadow-2xl
                bg-gradient-radial from-primary/40 via-primary-light/10 to-transparent
                px-3 sm:px-6 py-4
            "
        >
            {/* Stage: overflow hidden e altezza stabile */}
            <div className="relative overflow-hidden rounded-2xl min-h-[360px] sm:min-h-[380px]">
                {/* Track orizzontale a flex: ogni slide = 100% dello stage */}
                <div
                    className="flex h-full"
                    style={{
                        transform: `translateX(-${index * 100}%)`,
                        transition: "transform 350ms ease-in-out",
                        willChange: "transform",
                    }}
                >
                    {slides.map((s) => (
                        <div key={s.id} className="box-border w-full shrink-0 px-2 sm:px-4 pt-1 sm:pt-2">
                            <div className="h-full w-full">{s.node}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Frecce */}
            <button
                onClick={() => go(index - 1)}
                aria-label="Precedente"
                className="absolute left-4 top-1/2 -translate-y-1/2
                    p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
                <ArrowLeft size={22} />
            </button>
            <button
                onClick={() => go(index + 1)}
                aria-label="Successivo"
                className="absolute right-4 top-1/2 -translate-y-1/2
                    p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
                <ArrowRight size={22} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => go(i)}
                        aria-label={`Vai a slide ${i + 1}`}
                        className={`w-3 h-3 rounded-full ${i === index ? "bg-white shadow" : "bg-white/30"}`}
                    />
                ))}
            </div>
        </div>
    );
}
