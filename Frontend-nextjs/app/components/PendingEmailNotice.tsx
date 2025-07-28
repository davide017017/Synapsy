"use client";

import { useUser } from "@/context/contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PendingEmailNotice() {
    const { user, cancelPending, resendPending } = useUser();

    const handleCancel = async () => {
        if (confirm("Annullare la richiesta di cambio email?")) {
            await cancelPending();
        }
    };

    const handleResend = async () => {
        await resendPending();
    };

    return (
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
                    <p>Abbiamo inviato un link di conferma a questo indirizzo. Cliccalo per completare il cambio.</p>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05, opacity: 0.9 }}
                            className="px-2 py-1 rounded shadow bg-red-500 text-white text-xs font-semibold"
                            onClick={handleCancel}
                        >
                            Annulla richiesta
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, opacity: 0.9 }}
                            className="px-2 py-1 rounded shadow bg-blue-500 text-white text-xs font-semibold"
                            onClick={handleResend}
                        >
                            Reinvia email
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
