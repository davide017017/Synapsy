"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SynapsiNetwork from "./welcomeItem/SynapsiNetwork";

export default function HeroWelcome() {
    // ─────────────────────────────────────────
    // Scramble text animation
    // ─────────────────────────────────────────
    const finalWord = "SYNAPSY";
    const scrambleChars = "!<>-_\\/[]{}—=+*^?#$";
    const [displayWord, setDisplayWord] = useState("------");

    useEffect(() => {
        let frame = 0;
        const totalFrames = 36;

        const interval = window.setInterval(() => {
            const nextWord = finalWord
                .split("")
                .map((char, index) => {
                    const revealFrame = index * 4;

                    if (frame > revealFrame + 10) {
                        return char;
                    }

                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join("");

            setDisplayWord(nextWord);

            frame++;

            if (frame > totalFrames) {
                setDisplayWord(finalWord);
                window.clearInterval(interval);
            }
        }, 80);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full justify-center">
            <section
                className="
                    relative
                    min-h-[300px]
                    pt-3 pb-6
                    text-center
                    overflow-hidden
                "
            >
                {/* Animazione sinaptica sotto al contenuto */}
                <div
                    className="
                        absolute
                        inset-0
                        z-0
                        flex items-center justify-center
                        opacity-80
                        pointer-events-none
                    "
                >
                    <SynapsiNetwork />
                </div>

                {/* Contenuto sopra */}
                <div className="relative z-10">
                    {/* Titolo */}
                    <motion.div
                        initial={{ y: 18 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
                        className="
    relative z-10
    mx-auto
    w-fit
    font-mono
    uppercase
    drop-shadow-[0_14px_28px_rgba(0,0,0,0.95)]
"
                    >
                        <div
                            className="
        text-[12px] sm:text-sm
        tracking-[0.42em]
        font-semibold
        text-foreground/35 dark:text-foreground/45
    "
                            style={{
                                textShadow: `
    0 3px 14px rgba(0,0,0,1),
    0 8px 26px rgba(0,0,0,0.85)
`,
                            }}
                        >
                            Welcome to
                        </div>

                        <div
                            className="
        mt-1
        text-3xl sm:text-4xl
        tracking-[0.22em]
        font-extrabold
        text-primary
    "
                            style={{
                                textShadow: `
    0 3px 14px rgba(0,0,0,1),
    0 8px 26px rgba(0,0,0,0.85),
    0 0 18px rgba(20,184,138,0.45)
`,
                            }}
                        >
                            {displayWord}
                        </div>

                        {/* Sottotitolo */}
                        <motion.p
                            initial={{ y: 12 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
                            className="
        font-mono
        text-[11px] sm:text-xs
        tracking-[0.28em]
        uppercase
        whitespace-nowrap
        text-foreground/35 dark:text-foreground/45
    "
                            style={{
                                textShadow: `
                                0 3px 14px rgba(0,0,0,1),
                                0 8px 26px rgba(0,0,0,0.85)
                            `,
                            }}
                        >
                            {"// KNOWLEDGE · CONTROL · POWER"}
                        </motion.p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
