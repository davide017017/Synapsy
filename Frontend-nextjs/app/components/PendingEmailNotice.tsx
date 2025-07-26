"use client";

import { useUser } from "@/context/contexts/UserContext";

export default function PendingEmailNotice() {
    const { user, cancelPending, resendPending } = useUser();
    if (!user?.pending_email) return null;

    const handleCancel = async () => {
        if (confirm("Annullare la richiesta di cambio email?")) {
            await cancelPending();
        }
    };

    const handleResend = async () => {
        await resendPending();
    };

    return (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded p-3 mb-4 shadow space-y-2">
            <p>
                Cambio email in attesa di conferma: <strong>{user.pending_email}</strong>
            </p>
            <p>Abbiamo inviato un link di conferma a questo indirizzo. Cliccalo per completare il cambio.</p>
            <div className="flex gap-2">
                <button
                    className="px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold"
                    onClick={handleCancel}
                >
                    Annulla richiesta
                </button>
                <button
                    className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-semibold"
                    onClick={handleResend}
                >
                    Reinvia email
                </button>
            </div>
        </div>
    );
}
