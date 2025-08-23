"use client";

import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

export default function PendingEmailNotice() {
    const { user, cancelPending, resendPending } = useUser();
    const isDemo = user?.email === "demo@synapsy.app";

    // Stato per la dialog di conferma
    const [showConfirm, setShowConfirm] = useState(false);

    // Gestione annulla con dialog
    const handleCancel = () => setShowConfirm(true);

    const handleConfirmCancel = async () => {
        await cancelPending();
        setShowConfirm(false);
    };

    const handleResend = async () => {
        await resendPending();
    };

    return (
        <>
            <AnimatePresence>
                {user?.pending_email && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 rounded-xl shadow-md border border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 flex flex-col items-center text-center space-y-2"
                    >
                        <p>
                            Cambio email in attesa di conferma: <strong>{user.pending_email}</strong>
                        </p>
                        <p>
                            Abbiamo inviato un link di conferma a questo indirizzo. Cliccalo per completare il cambio.
                        </p>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={isDemo ? {} : { scale: 1.05, opacity: 0.9 }}
                                className="px-2 py-1 rounded-xl shadow bg-red-500 text-white text-xs font-semibold"
                                onClick={handleCancel}
                                disabled={isDemo}
                                style={{ opacity: isDemo ? 0.5 : undefined, pointerEvents: isDemo ? "none" : undefined }}
                            >
                                Annulla richiesta
                            </motion.button>
                            <motion.button
                                whileHover={isDemo ? {} : { scale: 1.05, opacity: 0.9 }}
                                className="px-2 py-1 rounded-xl shadow bg-blue-500 text-white text-xs font-semibold"
                                onClick={handleResend}
                                disabled={isDemo}
                                style={{ opacity: isDemo ? 0.5 : undefined, pointerEvents: isDemo ? "none" : undefined }}
                            >
                                Reinvia email
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialog di conferma */}
            <ConfirmDialog
                open={showConfirm}
                type="info"
                title="Annulla richiesta cambio email"
                message="Sei sicuro di voler annullare la richiesta di cambio email? Se annulli, dovrai rifare la procedura per cambiare email."
                confirmLabel="Sì, annulla"
                cancelLabel="No, torna indietro"
                onConfirm={handleConfirmCancel}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
