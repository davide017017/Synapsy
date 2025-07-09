// app/(protected)/home/hero/heroItems/HeroWelcome.tsx
"use client";

/**
 * Synapsi: la tua mente finanziaria digitale
 * Organizza, analizza e fai crescere il tuo budget con un tocco di stile.
 */

import { motion } from "framer-motion";
import SynapsiNetwork from "./welcomeItem/SynapsiNetwork";

// ─────────────────────────────────────────────────────────────────────────────
// HeroWelcome: sezione introduttiva con animazioni leggere e call-to-action
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroWelcome() {
    return (
        <section
            className={`
                relative
                pt-3 pb-6 px-6
                max-w-3xl mx-auto
                text-center
            `}
        >
            {/* ────────────── Synapsi Network (animazione sinaptica) ────────────── */}
            <SynapsiNetwork />

            {/* ─────────────────────────── Titolo ─────────────────────────── */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="
                    text-4xl sm:text-5xl font-extrabold
                    text-secondary-900 dark:text-secondary-100
                    mb-4
                "
            >
                Benvenuto su Synapsi!
            </motion.h1>

            {/* ──────────────────────── Sottotitolo ──────────────────────── */}
            <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="
                    text-lg
                    text-secondary-600 dark:text-secondary-400
                    mb-3
                "
            >
                Con Synapsi monitora ogni transazione in tempo reale, analizza le tendenze di spesa con precisione e
                pianifica investimenti basati su dati affidabili. Prendi il controllo del tuo futuro finanziario con
                strumenti professionali e{" "}
                <span className="text-primary-400 font-semibold">raggiungi i tuoi obiettivi più ambiziosi</span>.
            </motion.p>

            {/* ───────────────────── Call To Action ───────────────────── */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 120 }}
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
    );
}
