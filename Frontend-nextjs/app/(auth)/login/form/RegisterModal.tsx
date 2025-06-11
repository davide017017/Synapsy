"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl text-black"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">Registrazione</h2>
                        <p>Qui ci sarà il form di registrazione in futuro.</p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                        >
                            Chiudi
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
