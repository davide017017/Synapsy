"use client";

import { motion } from "framer-motion";
import SynapsiNetwork from "./welcomeItem/SynapsiNetwork";

export default function HeroWelcome() {
    return (
        <div className="flex flex-col h-full justify-center">
            <section
                className="
                    relative
                    pt-3 pb-6
                    text-center
                "
            >
                {/* Animazione sinaptica (sempre visibile) */}
                <SynapsiNetwork />

                {/* Titolo: solo movimento verticale, niente opacity */}
                <motion.h1
                    initial={{ y: 18 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
                    className="
                        text-4xl sm:text-5xl font-extrabold
                        text-secondary-900 dark:text-secondary-100
                        mb-4
                    "
                >
                    Benvenuto su Synapsi!
                </motion.h1>

                {/* Sottotitolo: solo movimento verticale */}
                <motion.p
                    initial={{ y: 12 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
                    className="
                        text-lg
                        text-secondary-600 dark:text-secondary-400
                        mb-3
                    "
                >
                    Monitora le transazioni in tempo reale, analizza le tendenze con precisione e pianifica investimenti
                    basati su dati affidabili.{" "}
                    <span className="text-primary-400 font-semibold">Raggiungi i tuoi obiettivi</span>.
                </motion.p>

                {/* CTA: solo scale, mai nascosta */}
                <motion.div
                    initial={{ scale: 0.96 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
                >
                    <a
                        href="/panoramica"
                        className="
                            inline-block
                            px-3 py-1
                            bg-primary-100 hover:bg-primary-200
                            text-primary-600
                            font-medium
                            rounded-lg shadow-lg
                            transition
                        "
                    >
                        🚀 Inizia Ora
                    </a>
                </motion.div>
            </section>
        </div>
    );
}
