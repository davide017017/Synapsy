// ╔══════════════════════════════════════════════════════════════╗
// ║ synapse.tsx — Linguaggio "Synapse" condiviso                 ║
// ║ (MobileMenu = sidebar mobile, UserMenu = menu avatar)        ║
// ║ - Palette e curve                                            ║
// ║ - Linea verticale, nodi, impulso                             ║
// ║ - Stile d'ingresso voci (da trasparente/sfocato a nitido)    ║
// ╚══════════════════════════════════════════════════════════════╝

import type { CSSProperties } from "react";

// ────────────────────────────────
// Palette e curve
// ────────────────────────────────
export const SYN = {
    green: "#3ddc97",
    muted: "#a8bab3",
    grey: "#5f716a",
    line: "#1d3a2f",
    nodeBorder: "#2d5546",
    red: "#ff6161",
    redSoft: "#ff8a8a",
    offline: "#e5484d",
} as const;

export const EASE = {
    depth: "cubic-bezier(.7,0,.2,1)", // linea, depth, clip-path
    pulse: "cubic-bezier(.6,0,.2,1)", // viaggio impulso
    item: "cubic-bezier(.2,.9,.1,1)", // ingresso voci
    spring: "cubic-bezier(.34,1.6,.5,1)", // pallini tema
} as const;

const PULSE_GLOW = {
    green: `0 0 0 4px rgba(61,220,151,.15), 0 0 18px ${SYN.green}`,
    red: `0 0 0 4px rgba(255,97,97,.18), 0 0 18px ${SYN.red}`,
};

// ────────────────────────────────
// Geometria rail: la lista ha `relative` + padding-left = padLeft
// x = centro linea (px dal bordo sinistro della lista)
// ────────────────────────────────
export type Rail = { x: number; itemH: number; padLeft: number };

// Linea verticale che si disegna dall'alto (scaleY 0→1)
export function SynapseLine({
    rail,
    drawn,
    animate,
    durationMs,
    delayMs,
}: {
    rail: Rail;
    drawn: boolean;
    animate: boolean; // false → nessuna transizione (reset o reduced motion)
    durationMs: number;
    delayMs: number;
}) {
    return (
        <span
            aria-hidden
            className="absolute top-2 bottom-2 w-[2px] origin-top"
            style={{
                left: rail.x - 1,
                background: SYN.line,
                transform: drawn ? "scaleY(1)" : "scaleY(0)",
                transition: animate ? `transform ${durationMs}ms ${EASE.depth} ${delayMs}ms` : "none",
            }}
        />
    );
}

// Nodo 6px sulla linea: va dentro il <li> relativo (altezza itemH)
export function SynapseNode({ rail, bg }: { rail: Rail; bg: string }) {
    return (
        <span
            aria-hidden
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
                left: rail.x - rail.padLeft - 3,
                top: rail.itemH / 2 - 3,
                background: bg,
                border: `1.5px solid ${SYN.nodeBorder}`,
            }}
        />
    );
}

// Impulso 12px: va dentro la lista relativa, viaggia verso il nodo `index`
export function SynapsePulse({
    rail,
    index,
    travelMs,
    color = "green",
}: {
    rail: Rail;
    index: number;
    travelMs: number; // 0 → salta senza animazione
    color?: "green" | "red";
}) {
    return (
        <span
            aria-hidden
            className="absolute top-0 h-3 w-3 rounded-full"
            style={{
                left: rail.x - 6,
                zIndex: 1,
                background: color === "red" ? SYN.red : SYN.green,
                boxShadow: PULSE_GLOW[color],
                transform: `translateY(${index * rail.itemH + rail.itemH / 2 - 6}px)`,
                transition:
                    travelMs > 0
                        ? `transform ${travelMs}ms ${EASE.pulse}, background 300ms, box-shadow 300ms`
                        : "background 300ms, box-shadow 300ms",
            }}
        />
    );
}

// ────────────────────────────────
// Ingresso voci: aperto → nitido con delay; in chiusura resta nitido
// finché visibile; si azzera solo a pannello già nascosto
// ────────────────────────────────
export function synapseEnter(
    { open, visible, reducedMotion }: { open: boolean; visible: boolean; reducedMotion: boolean },
    delayMs: number,
    { from = "none", blurPx = 6, durationMs = 450 }: { from?: string; blurPx?: number; durationMs?: number } = {},
): CSSProperties {
    if (reducedMotion) return {};
    if (open)
        return {
            opacity: 1,
            filter: "none",
            transform: "none",
            transition: `all ${durationMs}ms ${EASE.item} ${delayMs}ms`,
        };
    if (visible) return { opacity: 1, filter: "none", transform: "none", transition: "none" };
    return { opacity: 0, filter: blurPx ? `blur(${blurPx}px)` : "none", transform: from, transition: "none" };
}
