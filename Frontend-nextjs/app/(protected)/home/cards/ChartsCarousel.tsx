"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import UltimiMesiCard from "./UltimiMesiCard";
// future charts can be imported here

const SLIDES = [
    { id: "ultimi-mesi", component: <UltimiMesiCard /> },
    // add more slides here later
];

export default function ChartsCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // sync dot indicator with scroll position
    const onScroll = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const index = Math.round(track.scrollLeft / track.offsetWidth);
        setActiveIndex(index);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        track.addEventListener("scroll", onScroll, { passive: true });
        return () => track.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    const goTo = (index: number) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollTo({ left: index * track.offsetWidth, behavior: "smooth" });
    };

    return (
        <div className="relative w-full">
            {/* ── Track ── */}
            <div
                ref={trackRef}
                className="
                    flex
                    overflow-x-auto
                    scroll-smooth
                    snap-x snap-mandatory
                    scrollbar-hide
                    gap-0
                    w-full
                "
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {SLIDES.map((slide) => (
                    <div
                        key={slide.id}
                        className="snap-center shrink-0 w-full"
                    >
                        {slide.component}
                    </div>
                ))}
            </div>

            {/* ── Dot indicators (only if more than 1 slide) ── */}
            {SLIDES.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                    {SLIDES.map((slide, i) => (
                        <button
                            key={slide.id}
                            onClick={() => goTo(i)}
                            aria-label={`Slide ${i + 1}`}
                            className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${i === activeIndex
                                    ? "w-6 bg-primary"
                                    : "w-1.5 bg-white/20 hover:bg-white/40"
                                }
                            `}
                        />
                    ))}
                </div>
            )}

            {/* ── Desktop arrows (only if more than 1 slide) ── */}
            {SLIDES.length > 1 && (
                <>
                    <button
                        onClick={() => goTo(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-0 transition-all"
                        aria-label="Grafico precedente"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => goTo(activeIndex + 1)}
                        disabled={activeIndex === SLIDES.length - 1}
                        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-0 transition-all"
                        aria-label="Grafico successivo"
                    >
                        ›
                    </button>
                </>
            )}
        </div>
    );
}
