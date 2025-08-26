// app/(protected)/home/hero/heroItems/welcomeItem/SynapsiNetwork.tsx
"use client";

import { motion } from "framer-motion";

export default function SynapsiNetwork() {
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

    return (
        <div className="mx-auto mb-8" style={{ width: 150, height: 150 }}>
            <motion.svg
                viewBox="0 0 150 150"
                width="150"
                height="150"
                className="block"
                // niente opacity, keyframes per la rotazione
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
                // origine di trasformazione affidabile per SVG
                style={{ originX: 0.5, originY: 0.5 }}
            >
                {/* Linea animata (solo pathLength) */}
                <motion.polyline
                    points={path}
                    stroke="#10B981"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                    // niente initial; keyframes diretti
                    animate={{ pathLength: [0.2, 1, 0.2] }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />

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
            </motion.svg>
        </div>
    );
}
