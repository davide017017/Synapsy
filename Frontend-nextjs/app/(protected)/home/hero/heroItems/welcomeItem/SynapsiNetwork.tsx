// app/(protected)/home/hero/heroItems/welcomeItem/SynapsiNetwork.tsx
"use client";

import { motion, MotionConfig } from "framer-motion";

export default function SynapsiNetwork() {
    // Parametri modificabili (nomi chiari)
    const ORBIT_DURATION_SECONDS = 2; // velocità: più basso = più veloce
    const LINE_THICKNESS_PX = 3; // spessore della coda
    const PATH_LENGTH = 1000; // lunghezza virtuale usata per dash/offset
    const TAIL_VISIBLE_LENGTH = 150; // lunghezza coda (0–1000)
    const RUNNER_RADIUS_PX = 4; // raggio pallino
    const START_OFFSET_FRACTION = 0.5; // 0 = inizio path, 0.5 = lato opposto
    const REVERSE_DIRECTION = false; // true per invertire la direzione

    // Variabili colore
    const COLOR_TAIL = "#10B981"; // coda
    const COLOR_NODES = "#10B981"; // nodi
    const COLOR_RUNNER = "#10B981"; // pallino

    // 6 nodi in cerchio
    const center = { x: 75, y: 75 };
    const radius = 60;
    const nodes = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * 2 * Math.PI;
        return {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
        };
    });

    // Ruota il punto di partenza per posizionare l'orbita
    const rotateNodes = (arr: { x: number; y: number }[], fraction: number) => {
        const n = arr.length;
        const shift = ((Math.round(n * fraction) % n) + n) % n;
        return [...arr.slice(shift), ...arr.slice(0, shift)];
    };

    // Un singolo path di orbita, opzionalmente ruotato e direzionalmente invertito
    const orbitBase = rotateNodes(nodes, START_OFFSET_FRACTION);
    const orbitNodes = REVERSE_DIRECTION ? [...orbitBase].reverse() : orbitBase;
    const dOrbit = `M ${orbitNodes.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

    return (
        <div className="mx-auto mb-8" style={{ width: 150, height: 150 }}>
            <MotionConfig reducedMotion="never">
                <motion.svg
                    viewBox="0 0 150 150"
                    width="150"
                    height="150"
                    className="block"
                    style={{ originX: 0.5, originY: 0.5 }}
                >
                    {/* Path di riferimento (non visibile) */}
                    <path id="synapsi-orbit" d={dOrbit} fill="none" stroke="none" />

                    {/* Coda snake: il pallino resta sempre in testa */}
                    <path
                        d={dOrbit}
                        fill="none"
                        stroke={COLOR_TAIL}
                        strokeWidth={LINE_THICKNESS_PX}
                        strokeLinecap="round"
                        pathLength={PATH_LENGTH}
                        strokeDasharray={`${TAIL_VISIBLE_LENGTH} ${PATH_LENGTH - TAIL_VISIBLE_LENGTH}`}
                    >
                        {/* s(t) = TAIL_VISIBLE_LENGTH - q(t) → head = q(t) */}
                        <animate
                            attributeName="stroke-dashoffset"
                            from={`${TAIL_VISIBLE_LENGTH}`}
                            to={`${
                                REVERSE_DIRECTION
                                    ? TAIL_VISIBLE_LENGTH + PATH_LENGTH
                                    : TAIL_VISIBLE_LENGTH - PATH_LENGTH
                            }`}
                            dur={`${ORBIT_DURATION_SECONDS}s`}
                            repeatCount="indefinite"
                        />
                    </path>

                    {/* Nodi pulsanti */}
                    {nodes.map((pos, i) => (
                        <motion.circle
                            key={i}
                            cx={pos.x}
                            cy={pos.y}
                            r={4}
                            fill={COLOR_NODES}
                            animate={{ scale: [0.9, 1.15, 0.9] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Pallino runner (in testa alla coda) */}
                    <g>
                        <circle r={RUNNER_RADIUS_PX} fill={COLOR_RUNNER}>
                            <animateMotion dur={`${ORBIT_DURATION_SECONDS}s`} repeatCount="indefinite" rotate="auto">
                                <mpath xlinkHref="#synapsi-orbit" />
                            </animateMotion>
                        </circle>
                    </g>
                </motion.svg>
            </MotionConfig>
        </div>
    );
}
