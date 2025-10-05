// app/(protected)/home/hero/heroItems/welcomeItem/SynapsiNetwork.tsx
"use client";

// ╔══════════════════════════════════════════════════════════╗
// ║ SynapsiNetwork — Random Walk + Slow Board Rotation      ║
/* ║  • Nodi fissi (pallini) — numero configurabile           ║
║  • Runner che salta tra nodi casuali                     ║
║  • Coda (trail) degli ultimi punti                       ║
   ║  • Rotazione lenta dell’intera “tavola”                  ║ */
// ╚══════════════════════════════════════════════════════════╝

import { MotionConfig, useMotionValue, animate, useAnimationFrame, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────
// Parametri regolabili (tuning facile)
// ─────────────────────────────────────────────────────────
/** Canvas */
const VIEWBOX_W = 250;
const VIEWBOX_H = 150;
const WRAP_W = 150; // px
const WRAP_H = 150; // px

/** Nodi esterni (esagono di base, ma scalabile) */
const NUM_NODES = 8; // 🔧 numero pallini esterni
const RING_RADIUS = 100; // raggio della corona
const NODE_RADIUS_PX = 4; // raggio visivo dei nodi
const NODE_PULSE_DURATION = 2; // durata pulsazione
const NODE_PULSE_DELAY_STEP = 0.12;

/** Runner + coda */
const HOP_DURATION_SECONDS = 0.5; // durata di ogni salto A→B
const TAIL_POINTS = 100; // lunghezza coda (numero di campioni)
const SAMPLE_EVERY_MS = 16; // campionamento trail (~60fps)
const LINE_THICKNESS_PX = 3; // spessore linea coda
const RUNNER_RADIUS_PX = 4; // raggio del pallino runner

/** Colori */
const COLOR_TAIL = "#10B981";
const COLOR_NODES = "#10B981";
const COLOR_RUNNER = "#10B981";

/** Rotazione della “tavola” */
const ROTATE_BOARD = true; // abilita/disabilita rotazione globale
const BOARD_ROTATION_PERIOD_S = 30; // secondi per 360° (più alto = più lento)

// ─────────────────────────────────────────────────────────
// Tipi & utilità
// ─────────────────────────────────────────────────────────
type Pt = { x: number; y: number };

function pickNextIndex(cur: number, prev: number | null, n: number): number {
    // evita stesso nodo e (se possibile) evita di tornare subito indietro
    const candidates = Array.from({ length: n }, (_, i) => i).filter((i) => i !== cur && i !== prev);
    if (candidates.length === 0) {
        const alts = Array.from({ length: n }, (_, i) => i).filter((i) => i !== cur);
        return alts[Math.floor(Math.random() * alts.length)];
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function ptsToPolyline(points: Pt[]): string {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
}

// ─────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────
export default function SynapsiNetwork() {
    // ── Centro viewbox ──
    const center = { x: VIEWBOX_W / 2, y: VIEWBOX_H / 2 };

    // ── Nodi: NUM_NODES su corona (equangolari) ──
    const nodes = useMemo<Pt[]>(
        () =>
            Array.from({ length: NUM_NODES }).map((_, i) => {
                const a = (i / NUM_NODES) * 2 * Math.PI;
                return { x: center.x + Math.cos(a) * RING_RADIUS, y: center.y + Math.sin(a) * RING_RADIUS };
            }),
        [center.x, center.y] // NUM_NODES è costante a runtime; se lo trasformi in prop, aggiungilo qui
    );

    // ── Stato random-walk ──
    const [curIdx, setCurIdx] = useState(() => Math.floor(Math.random() * nodes.length));
    const prevIdxRef = useRef<number | null>(null);

    // ── MotionValue posizione runner ──
    const cx = useMotionValue(nodes[curIdx]?.x ?? center.x);
    const cy = useMotionValue(nodes[curIdx]?.y ?? center.y);

    // ── Trail (coda) ──
    const trailRef = useRef<Pt[]>([{ x: cx.get(), y: cy.get() }]);
    const [trailVersion, setTrailVersion] = useState(0); // trigger del polyline

    // ── Loop salti tra nodi casuali ──
    useEffect(() => {
        let stop = false;

        async function hopLoop() {
            while (!stop) {
                const nextIdx = pickNextIndex(curIdx, prevIdxRef.current, nodes.length);
                prevIdxRef.current = curIdx;

                const target = nodes[nextIdx];
                const aX = animate(cx, target.x, { duration: HOP_DURATION_SECONDS, ease: "linear" });
                const aY = animate(cy, target.y, { duration: HOP_DURATION_SECONDS, ease: "linear" });

                await Promise.all([aX.finished, aY.finished]);
                setCurIdx(nextIdx);
            }
        }

        // solo se ho nodi
        if (nodes.length > 0) hopLoop();
        return () => {
            stop = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curIdx, nodes]);

    // ── Campionamento coda ~60fps ──
    const lastSampleRef = useRef<number>(0);
    useAnimationFrame((t) => {
        if (t - lastSampleRef.current < SAMPLE_EVERY_MS) return;
        lastSampleRef.current = t;

        const p = { x: cx.get(), y: cy.get() };
        const arr = trailRef.current;
        arr.push(p);
        if (arr.length > TAIL_POINTS) arr.shift();
        setTrailVersion((v) => v + 1);
    });

    // ── Rotazione globale ──
    const boardRotationProps =
        ROTATE_BOARD && BOARD_ROTATION_PERIOD_S > 0
            ? {
                  animate: { rotate: 360 },
                  transition: { duration: BOARD_ROTATION_PERIOD_S, repeat: Infinity, ease: "linear" as const },
                  style: { originX: 0.5, originY: 0.5 }, // centro del viewBox
              }
            : {};

    // ───────────────────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────────────────
    return (
        <div className="mx-auto mb-8" style={{ width: WRAP_W, height: WRAP_H }}>
            <MotionConfig reducedMotion="never">
                <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} width={WRAP_W} height={WRAP_H} className="block">
                    {/* Tavola rotante: contiene trail + nodi + runner */}
                    <motion.g {...boardRotationProps}>
                        {/* Coda */}
                        <polyline
                            key={trailVersion /* update fluido */}
                            points={ptsToPolyline(trailRef.current)}
                            fill="none"
                            stroke={COLOR_TAIL}
                            strokeWidth={LINE_THICKNESS_PX}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Nodi pulsanti */}
                        {nodes.map((pos, i) => (
                            <motion.circle
                                key={i}
                                cx={pos.x}
                                cy={pos.y}
                                r={NODE_RADIUS_PX}
                                fill={COLOR_NODES}
                                animate={{ scale: [0.9, 1.15, 0.9] }}
                                transition={{
                                    duration: NODE_PULSE_DURATION,
                                    repeat: Infinity,
                                    delay: i * NODE_PULSE_DELAY_STEP,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}

                        {/* Runner */}
                        <motion.circle r={RUNNER_RADIUS_PX} fill={COLOR_RUNNER} cx={cx} cy={cy} />
                    </motion.g>
                </svg>
            </MotionConfig>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Descrizione file
// ─────────────────────────────────────────────────────────
// Cosa fa:
// • Mostra una rete di N nodi (NUM_NODES) e un runner che compie un “random walk” tra i nodi.
// • Mantiene una coda (polyline) dei campioni recenti del runner.
// • Può ruotare lentamente l’intera scena (ROTATE_BOARD).
// Come lo fa:
// • Genera i nodi su una corona (RING_RADIUS) centrata nel viewbox.
// • Anima cx/cy con framer-motion verso il prossimo nodo scelto casualmente (no self/prev-immediate).
// • Campiona ~60fps per aggiornare il trail.
// Parametri chiave:
// • NUM_NODES, RING_RADIUS, NODE_RADIUS_PX, NODE_PULSE_DURATION, NODE_PULSE_DELAY_STEP
// • HOP_DURATION_SECONDS, TAIL_POINTS, SAMPLE_EVERY_MS, LINE_THICKNESS_PX, RUNNER_RADIUS_PX
// • ROTATE_BOARD, BOARD_ROTATION_PERIOD_S, VIEWBOX_W/H, WRAP_W/H.
// Note:
// • Se trasformi NUM_NODES/RING_RADIUS in prop o stato, aggiungili nelle deps del useMemo.
// • Per una coda con dissolvenza, suddividi la polyline in segmenti con opacità decrescente.
