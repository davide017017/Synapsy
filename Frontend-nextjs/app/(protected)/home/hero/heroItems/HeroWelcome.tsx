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
                {/* Titolo */}
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

                {/* Sottotitolo */}
                <motion.p
                    initial={{ y: 12 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
                    className="
                  text-xl tracking-[0.2em]
                  text-primary-300 dark:text-primary-200
                  mb-3
                "
                >
                    Sapere - Controllo - Potere
                </motion.p>
                {/* Animazione sinaptica */}
                <SynapsiNetwork />
            </section>
        </div>
    );
}
