"use client";

const NODES = [
    { x: 86,  y: 44,  accent: false },
    { x: 98,  y: 40,  accent: true  },
    { x: 110, y: 44,  accent: false },
    { x: 74,  y: 58,  accent: false },
    { x: 86,  y: 56,  accent: false },
    { x: 100, y: 56,  accent: true  },
    { x: 114, y: 56,  accent: false },
    { x: 126, y: 58,  accent: false },
    { x: 64,  y: 72,  accent: false },
    { x: 76,  y: 72,  accent: false },
    { x: 90,  y: 72,  accent: true  },
    { x: 104, y: 72,  accent: false },
    { x: 118, y: 72,  accent: true  },
    { x: 132, y: 72,  accent: false },
    { x: 58,  y: 86,  accent: false },
    { x: 72,  y: 86,  accent: false },
    { x: 86,  y: 86,  accent: false },
    { x: 100, y: 86,  accent: true  },
    { x: 114, y: 86,  accent: false },
    { x: 128, y: 86,  accent: false },
    { x: 140, y: 86,  accent: false },
    { x: 56,  y: 100, accent: false },
    { x: 70,  y: 100, accent: true  },
    { x: 84,  y: 100, accent: false },
    { x: 98,  y: 100, accent: false },
    { x: 112, y: 100, accent: false },
    { x: 126, y: 100, accent: true  },
    { x: 140, y: 100, accent: false },
    { x: 62,  y: 114, accent: false },
    { x: 76,  y: 114, accent: false },
    { x: 90,  y: 114, accent: true  },
    { x: 104, y: 114, accent: false },
    { x: 118, y: 114, accent: false },
    { x: 132, y: 114, accent: false },
    { x: 68,  y: 128, accent: false },
    { x: 82,  y: 128, accent: false },
    { x: 96,  y: 128, accent: false },
    { x: 110, y: 128, accent: true  },
    { x: 124, y: 128, accent: false },
    { x: 78,  y: 142, accent: false },
    { x: 92,  y: 142, accent: false },
    { x: 106, y: 142, accent: false },
    { x: 120, y: 142, accent: false },
];

export default function SplashScreen() {
    return (
        <div
            role="status"
            aria-label="Caricamento Synapsy"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020f0a]"
        >
            {/* ── Glow radiale centrale ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--color-primary, #4ade80) 15%, transparent), transparent 70%)",
                }}
            />

            {/* ── Cervello pixel-grid ── */}
            <svg
                viewBox="0 0 200 200"
                width="160"
                height="160"
                aria-hidden="true"
                className="relative text-white/20"
            >
                <defs>
                    <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {NODES.map((node, i) => (
                    <rect
                        key={i}
                        x={node.x - 3}
                        y={node.y - 3}
                        width="6"
                        height="6"
                        rx="1"
                        className={node.accent ? "fill-primary node" : "fill-current node"}
                        style={{
                            animationDelay: `${i * 0.05}s`,
                            ...(node.accent ? { filter: "url(#node-glow)" } : {}),
                        }}
                    />
                ))}
            </svg>

            {/* ── Wordmark ── */}
            <span
                className="relative mt-8 text-lg font-semibold text-primary/80 select-none"
                style={{ letterSpacing: "0.18em" }}
            >
                SYNAPSY
            </span>

            {/* ── Progress bar ── */}
            <div className="relative mt-3 w-20 h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full w-8 bg-primary rounded-full"
                    style={{ animation: "splash-progress 1.2s ease-in-out infinite" }}
                />
            </div>
        </div>
    );
}
