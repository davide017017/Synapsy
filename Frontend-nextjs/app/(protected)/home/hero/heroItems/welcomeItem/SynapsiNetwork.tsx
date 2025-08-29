// app/(protected)/home/hero/heroItems/welcomeItem/SynapsiNetwork.tsx
"use client";

import { motion, MotionConfig } from "framer-motion";

export default function SynapsiNetwork() {
    // Parametri modificabili (nomi chiari)
    const ORBIT_DURATION_SECONDS = 3; // velocità: più basso = più veloce
    const LINE_THICKNESS_PX = 3; // spessore della coda
    const TAIL_VISIBLE_LENGTH = 80; // lunghezza coda (0–1000)
    const RUNNER_RADIUS_PX = 4; // raggio pallino
    const START_OFFSET_FRACTION = 0.5; // 0 = inizio path, 0.5 = lato opposto
    const REVERSE_DIRECTION = false; // true per invertire la direzione

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

    const path = [...nodes, nodes[0]].map((p) => `${p.x},${p.y}`).join(" ");
    const dTail = `M ${nodes.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

    // Ruota il punto di partenza per posizionare il runner "dalla altra parte"
    const rotateNodes = (arr: { x: number; y: number }[], fraction: number) => {
        const n = arr.length;
        const shift = ((Math.round(n * fraction) % n) + n) % n;
        return [...arr.slice(shift), ...arr.slice(0, shift)];
    };
    const runnerNodes = rotateNodes(nodes, START_OFFSET_FRACTION);
    const dRunner = `M ${runnerNodes.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

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
                    {/* Path di riferimento (non visibili) */}
                    <path id="synapsi-orbit-tail" d={dTail} fill="none" stroke="none" />
                    <path id="synapsi-orbit-runner" d={dRunner} fill="none" stroke="none" />

                    {/* Coda snake: singolo segmento che segue il punto */}
                    <path
                        d={dTail}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth={LINE_THICKNESS_PX}
                        strokeLinecap="round"
                        pathLength={1000}
                        strokeDasharray={`${TAIL_VISIBLE_LENGTH} 1000`}
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            values={REVERSE_DIRECTION ? "0;1000" : "0;-1000"}
                            dur={`${ORBIT_DURATION_SECONDS}s`}
                            repeatCount="indefinite"
                        />
                    </path>

                    {/* Nodi pulsanti (solo scale) */}
                    {nodes.map((pos, i) => (
                        <motion.circle
                            key={i}
                            cx={pos.x}
                            cy={pos.y}
                            r={4}
                            fill="#10B981"
                            // niente initial; keyframes diretti
                            animate={{ scale: [0.9, 1.15, 0.9] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                    {/* Runner SVG nativo che segue il perimetro (verde) */}
                    <g>
                        <circle r={RUNNER_RADIUS_PX} fill="#10B981">
                            <animateMotion dur={`${ORBIT_DURATION_SECONDS}s`} repeatCount="indefinite" rotate="auto">
                                <mpath xlinkHref="#synapsi-orbit-runner" />
                            </animateMotion>
                        </circle>
                    </g>
                </motion.svg>
            </MotionConfig>
        </div>
    );
}
