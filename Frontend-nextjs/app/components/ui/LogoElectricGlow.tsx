"use client";

// ────────────────────────────────────────────────
// LogoElectricGlow — logo con glow + fulmine random
// ────────────────────────────────────────────────

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

// ────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────
type LogoElectricGlowProps = {
    size?: number;
    glowSize?: number;
    spinSpeed?: string;
    shockMinDelay?: number;
    shockMaxDelay?: number;
    shockDuration?: number;
    shockIntensity?: number;
};

// ────────────────────────────────────────────────
// Utility random
// ────────────────────────────────────────────────
function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

// ────────────────────────────────────────────────
// Genera path fulmine casuale
// ────────────────────────────────────────────────
function createLightningPath(viewBoxSize: number, intensity: number) {
    const center = viewBoxSize / 2;
    const points = 7;
    const length = randomBetween(30, 44) * intensity;
    const spread = randomBetween(5, 12) * intensity;
    const startY = center - length / 2;

    let path = `M ${center} ${startY}`;

    for (let i = 1; i <= points; i++) {
        const y = startY + (length / points) * i;
        const x = center + randomBetween(-spread, spread);

        path += ` L ${x} ${y}`;
    }

    return path;
}

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
export default function LogoElectricGlow({
    size = 32,
    glowSize = 58,
    spinSpeed = "8s",
    shockMinDelay = 2500,
    shockMaxDelay = 7500,
    shockDuration = 420,
    shockIntensity = 1,
}: LogoElectricGlowProps) {
    const [shockKey, setShockKey] = useState(0);
    const [isShocking, setIsShocking] = useState(false);

    // ────────────────────────────────────────────────
    // Dati random del fulmine
    // ────────────────────────────────────────────────
    const shock = useMemo(() => {
        const viewBoxSize = 80;

        return {
            path: createLightningPath(viewBoxSize, shockIntensity),
            rotation: randomBetween(0, 360),
            scale: randomBetween(0.85, 1.15) * shockIntensity,
            translateX: randomBetween(-6, 6) * shockIntensity,
            translateY: randomBetween(-6, 6) * shockIntensity,
            viewBoxSize,
        };
    }, [shockKey, shockIntensity]);

    // ────────────────────────────────────────────────
    // Trigger random scossa
    // ────────────────────────────────────────────────
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let clearId: ReturnType<typeof setTimeout>;

        const triggerShock = () => {
            setShockKey((prev) => prev + 1);
            setIsShocking(true);

            clearId = setTimeout(() => {
                setIsShocking(false);
            }, shockDuration);

            const randomDelay = randomBetween(shockMinDelay, shockMaxDelay);
            timeoutId = setTimeout(triggerShock, randomDelay);
        };

        timeoutId = setTimeout(triggerShock, randomBetween(shockMinDelay, shockMaxDelay));

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(clearId);
        };
    }, [shockMinDelay, shockMaxDelay, shockDuration]);

    // ────────────────────────────────────────────────
    // Valori CSS regolabili
    // ────────────────────────────────────────────────
    const cssVars = {
        "--logo-size": `${size}px`,
        "--logo-glow-size": `${glowSize}px`,
        "--logo-glow-speed": spinSpeed,
        "--shock-duration": `${shockDuration}ms`,
        "--shock-extra-size": `${18 * shockIntensity}px`,
        "--shock-blur": `${10 * shockIntensity}px`,
        "--shock-opacity": `${Math.min(0.45, 0.28 * shockIntensity)}`,
        "--shock-stroke-main": `${2.1 * shockIntensity}px`,
        "--shock-stroke-glow": `${5.4 * shockIntensity}px`,
    } as React.CSSProperties;

    // ────────────────────────────────────────────────
    // Render
    // ────────────────────────────────────────────────
    return (
        <div className="logo-electric-wrap" style={cssVars}>
            {/* Glow rotante */}
            <span className="logo-glow-orbit" aria-hidden="true" />

            {/* Flash interno */}
            {isShocking && <span key={`flash-${shockKey}`} className="logo-electric-flash" aria-hidden="true" />}

            {/* Fulmine SVG random */}
            {isShocking && (
                <svg
                    key={`bolt-${shockKey}`}
                    className="logo-electric-bolt"
                    viewBox={`0 0 ${shock.viewBoxSize} ${shock.viewBoxSize}`}
                    aria-hidden="true"
                    style={{
                        transform: `
                            translate(${shock.translateX}px, ${shock.translateY}px)
                            rotate(${shock.rotation}deg)
                            scale(${shock.scale})
                        `,
                    }}
                >
                    <path className="logo-electric-bolt-glow" d={shock.path} />
                    <path className="logo-electric-bolt-main" d={shock.path} />
                </svg>
            )}

            {/* Logo */}
            <Image
                src="/images/icon_1024x1024.webp"
                alt="Synapsi logo"
                width={size}
                height={size}
                priority
                className={`
                    relative z-10
                    h-8 w-auto
                    transition-transform duration-100
                    drop-shadow-[0_0_12px_hsl(var(--c-primary)/0.35)]
                    ${isShocking ? "logo-electric-shake" : ""}
                `}
            />

            {/* CSS scoped */}
            <style jsx>{`
                .logo-electric-wrap {
                    position: relative;
                    width: var(--logo-glow-size);
                    height: var(--logo-glow-size);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: auto;
                }

                .logo-glow-orbit {
                    position: absolute;
                    inset: 0;
                    border-radius: 9999px;
                    background: conic-gradient(
                        from 0deg,
                        transparent 0deg,
                        hsl(var(--c-primary) / 0.05) 70deg,
                        hsl(var(--c-primary) / 0.55) 125deg,
                        transparent 185deg,
                        hsl(var(--c-primary) / 0.25) 265deg,
                        transparent 360deg
                    );
                    filter: blur(7px);
                    opacity: 0.85;
                    animation: logoGlowSpin var(--logo-glow-speed) linear infinite;
                }

                .logo-electric-flash {
                    position: absolute;
                    z-index: 5;
                    width: calc(var(--logo-size) + var(--shock-extra-size));
                    height: calc(var(--logo-size) + var(--shock-extra-size));
                    border-radius: 9999px;
                    background: hsl(var(--c-primary) / var(--shock-opacity));
                    filter: blur(var(--shock-blur));
                    animation: logoFlash var(--shock-duration) ease-out forwards;
                }

                .logo-electric-bolt {
                    position: absolute;
                    z-index: 20;
                    width: calc(var(--logo-glow-size) + var(--shock-extra-size));
                    height: calc(var(--logo-glow-size) + var(--shock-extra-size));
                    overflow: visible;
                    pointer-events: none;
                    animation: logoBoltFlicker var(--shock-duration) steps(4, end) forwards;
                }

                .logo-electric-bolt-main {
                    fill: none;
                    stroke: white;
                    stroke-width: var(--shock-stroke-main);
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    filter: drop-shadow(0 0 4px white) drop-shadow(0 0 7px hsl(var(--c-primary)));
                }

                .logo-electric-bolt-glow {
                    fill: none;
                    stroke: hsl(var(--c-primary));
                    stroke-width: var(--shock-stroke-glow);
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    opacity: 0.58;
                    filter: blur(2px);
                }

                :global(.logo-electric-shake) {
                    animation: logoShake var(--shock-duration) linear forwards;
                }

                @keyframes logoGlowSpin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes logoFlash {
                    0% {
                        opacity: 0;
                        transform: scale(0.72);
                    }

                    12% {
                        opacity: 1;
                        transform: scale(1.08);
                    }

                    28% {
                        opacity: 0.42;
                        transform: scale(0.9);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.38);
                    }
                }

                @keyframes logoBoltFlicker {
                    0% {
                        opacity: 0;
                    }

                    12% {
                        opacity: 1;
                    }

                    25% {
                        opacity: 0.18;
                    }

                    42% {
                        opacity: 1;
                    }

                    65% {
                        opacity: 0.42;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                @keyframes logoShake {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }

                    15% {
                        transform: translate(-1px, 1px) rotate(-2deg);
                    }

                    30% {
                        transform: translate(1px, -1px) rotate(2deg);
                    }

                    45% {
                        transform: translate(-1px, -1px) rotate(-1deg);
                    }

                    60% {
                        transform: translate(1px, 1px) rotate(1deg);
                    }

                    100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                }
            `}</style>
        </div>
    );
}

/*
 * LogoElectricGlow.tsx
 *
 * Serve a: mostrare il logo Synapsi con glow rotante e scossa elettrica casuale.
 *
 * Cosa fa: aggiunge un alone rotante continuo, un flash rapido e un fulmine SVG
 * generato con traiettoria random a intervalli casuali.
 *
 * Come lo fa: usa props regolabili per velocità, frequenza, durata e intensità;
 * genera un path SVG casuale per il fulmine e mantiene tutto isolato nel componente.
 */
