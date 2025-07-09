// app/(protected)/home/hero/HeroCarousel.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Import dei singoli heroItems
// ─────────────────────────────────────────────────────────────────────────────
import HeroWelcome from "./heroItems/HeroWelcome";
import HeroSaldo from "./heroItems/HeroSaldo";
import HeroSuggerimento from "./heroItems/HeroSuggerimento";

// ─────────────────────────────────────────────────────────────────────────────
// HeroCarousel — carosello principale pulito, colori Tailwind classici
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroCarousel() {
    // Stato corrente della slide
    const [index, setIndex] = useState(0);
    const slides = [<HeroWelcome key="welcome" />, <HeroSaldo key="saldo" />, <HeroSuggerimento key="suggerimento" />];
    const total = slides.length;

    // Navigazione ciclica
    const goTo = (i: number) => {
        setIndex((i + total) % total);
    };

    return (
        <div
            className="
                relative w-full max-w-3xl mx-auto
                bg-gradient-radial 
                from-primary/40 
                via-primary-light/10 
                to-transparent
                rounded-3xl shadow-2xl
                px-8 py-3 flex items-center
                min-h-[280px] sm:min-h-[340px]
            "
        >
            {/* ────────── Freccia Sinistra ────────── */}
            <button
                onClick={() => goTo(index - 1)}
                aria-label="Precedente"
                className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    p-2 rounded-full
                    bg-white/20 hover:bg-white/30
                    transition-shadow
                "
            >
                <ArrowLeft size={22} />
            </button>

            {/* ─────────── Slide Animata ──────────── */}
            <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full h-full"
                    >
                        {slides[index]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ────────── Freccia Destra ─────────── */}
            <button
                onClick={() => goTo(index + 1)}
                aria-label="Successivo"
                className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    p-2 rounded-full
                    bg-white/20 hover:bg-white/30
                    transition-shadow
                "
            >
                <ArrowRight size={22} />
            </button>

            {/* ─────────── Paginazione ───────────── */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
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
