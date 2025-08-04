// app/(protected)/home/hero/heroItems/welcomeItem/SynapsiNetwork.tsx
"use client";

import { motion } from "framer-motion";

export default function SynapsiNetwork() {
    // Genera 6 nodi disposti a cerchio
    const center = { x: 75, y: 75 };
    const radius = 60;
    const nodes = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * 2 * Math.PI;
        return {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
        };
    });

    // Path che connette i nodi in loop
    const path = [...nodes, nodes[0]].map((p) => `${p.x},${p.y}`).join(" ");

    return (
        <div className="mx-auto mb-8" style={{ width: 150, height: 150 }}>
            <motion.svg
                viewBox="0 0 150 150"
                width="150"
                height="150"
                className="block"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
            >
                {/* Linea animata */}
                <motion.polyline
                    points={path}
                    stroke="#10B981"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                {/* Nodi pulsanti */}
                {nodes.map((pos, i) => (
                    <motion.circle
                        key={i}
                        cx={pos.x}
                        cy={pos.y}
                        r={4}
                        fill="#10B981"
                        initial={{ scale: 0.8, opacity: 0.7 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "loop",
                            delay: (i * 0.5) / nodes.length,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.svg>
        </div>
    );
}

