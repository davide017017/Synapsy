"use client";

// ────────────────────────────────────────────────
// LogoElectricGlow — logo con glow + fulmine random
// ────────────────────────────────────────────────

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    navigateTo?: string;
    clickShockDuration?: number;
    fullscreenBoltCount?: number;
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
    navigateTo = "/",
    clickShockDuration = 850,
}: LogoElectricGlowProps) {
    const router = useRouter();

    const [shockKey, setShockKey] = useState(0);
    const [isShocking, setIsShocking] = useState(false);
    const [isClickShock, setIsClickShock] = useState(false);

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
            if (isClickShock) return;

            setShockKey((prev) => prev + 1);
            setIsShocking(true);

            clearId = setTimeout(() => {
                setIsShocking(false);
            }, shockDuration);

            timeoutId = setTimeout(triggerShock, randomBetween(shockMinDelay, shockMaxDelay));
        };

        timeoutId = setTimeout(triggerShock, randomBetween(shockMinDelay, shockMaxDelay));

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(clearId);
        };
    }, [shockMinDelay, shockMaxDelay, shockDuration, isClickShock]);

    // ────────────────────────────────────────────────
    // Click logo: scossa fullscreen + navigazione
    // ────────────────────────────────────────────────
    const handleLogoClick = () => {
        if (isClickShock) return;

        setIsClickShock(true);
        setIsShocking(true);
        setShockKey((prev) => prev + 1);

        setTimeout(() => {
            router.push(navigateTo);
        }, clickShockDuration);

        // Reset necessario se si clicca già dalla stessa pagina
        setTimeout(() => {
            setIsClickShock(false);
            setIsShocking(false);
        }, clickShockDuration + 150);
    };

    // ────────────────────────────────────────────────
    // Valori CSS regolabili
    // ────────────────────────────────────────────────
    const cssVars = {
        "--logo-size": `${size}px`,
        "--logo-glow-size": `${glowSize}px`,
        "--logo-glow-speed": spinSpeed,
        "--shock-duration": `${shockDuration}ms`,
        "--click-shock-duration": `${clickShockDuration}ms`,
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
        <>
            <button
                type="button"
                className="logo-electric-wrap"
                style={cssVars}
                onClick={handleLogoClick}
                aria-label="Vai alla home"
            >
                {/* Glow rotante */}
                <span className="logo-glow-orbit" aria-hidden="true" />

                {/* Flash interno */}
                {isShocking && <span key={`flash-${shockKey}`} className="logo-electric-flash" aria-hidden="true" style={isClickShock ? { background: "hsl(271 81% 56% / var(--shock-opacity))" } : undefined} />}

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
                        <path className="logo-electric-bolt-glow" d={shock.path} style={isClickShock ? { stroke: "#a855f7" } : undefined} />
                        <path className="logo-electric-bolt-main" d={shock.path} style={isClickShock ? { stroke: "#e9d5ff", filter: "drop-shadow(0 0 4px #e9d5ff) drop-shadow(0 0 7px #a855f7)" } : undefined} />
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
            </button>

            {/* Scossa fullscreen al click */}
            {isClickShock && <span className="logo-fullscreen-shock" style={{ ...cssVars, "--shock-color": "#a855f7" } as React.CSSProperties} aria-hidden="true" />}

            {/* CSS scoped */}
            <style jsx>{`
                .logo-electric-wrap {
                    position: relative;
                    width: var(--logo-glow-size);
                    height: var(--logo-glow-size);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 0;
                    padding: 0;
                    background: transparent;
                    cursor: pointer;
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

                .logo-fullscreen-shock {
                    --shock-color: hsl(var(--c-primary));
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    pointer-events: none;
                    background:
                        radial-gradient(circle at 50% 14%, color-mix(in srgb, var(--shock-color) 75%, transparent), transparent 16%),
                        radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--shock-color) 22%, transparent), transparent 44%),
                        linear-gradient(
                            115deg,
                            transparent 0%,
                            transparent 40%,
                            white 43%,
                            color-mix(in srgb, var(--shock-color) 90%, transparent) 45%,
                            white 47%,
                            transparent 51%
                        );
                    filter: drop-shadow(0 0 20px var(--shock-color))
                        drop-shadow(0 0 46px color-mix(in srgb, var(--shock-color) 70%, transparent));
                    animation: logoFullscreenShock var(--click-shock-duration) ease-out forwards;
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

                @keyframes logoFullscreenShock {
                    0% {
                        opacity: 0;
                        transform: scale(0.85) rotate(0deg);
                        clip-path: polygon(48% 0%, 56% 0%, 45% 34%, 67% 36%, 37% 100%, 44% 58%, 27% 57%);
                    }

                    10% {
                        opacity: 1;
                        transform: scale(1.02) rotate(8deg);
                    }

                    24% {
                        opacity: 0.35;
                        transform: scale(1.08) rotate(-6deg);
                    }

                    42% {
                        opacity: 0.9;
                        transform: scale(1.15) rotate(4deg);
                    }

                    70% {
                        opacity: 0.28;
                        transform: scale(1.22) rotate(-2deg);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.35) rotate(0deg);
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
        </>
    );
}

/*
 * LogoElectricGlow.tsx
 *
 * Serve a: mostrare il logo Synapsi con glow rotante, scossa casuale e scossa fullscreen al click.
 *
 * Cosa fa: aggiunge un alone rotante continuo, un fulmine SVG random, una vibrazione del logo
 * e una scossa fullscreen prima della navigazione verso la home.
 *
 * Come lo fa: usa props regolabili per velocità, frequenza, durata e intensità;
 * usa router.push dopo un delay per lasciare visibile l’animazione fullscreen.
 */
