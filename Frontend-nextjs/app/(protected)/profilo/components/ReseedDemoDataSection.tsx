"use client";

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ ReseedDemoDataSection — Rigenera i dati demo on-demand (solo utente demo)  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { reseedDemoData } from "@/lib/api/userApi";
import { useUser } from "@/context/UserContext";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import { Input } from "@/app/components/ui/Input";

export default function ReseedDemoDataSection() {
    const { data: session } = useSession();
    const { user } = useUser();
    const token = session?.accessToken as string | undefined;

    const [open, setOpen] = useState(false);
    const [secret, setSecret] = useState("");
    const [loading, setLoading] = useState(false);

    // ─── visibile solo per l'utente demo ───────────────────────────────────
    if (!user?.is_demo) return null;

    const handleClose = () => {
        if (loading) return;
        setOpen(false);
        setSecret("");
    };

    const handleConfirm = async () => {
        if (!token) return;
        if (!secret.trim()) {
            toast.error("Inserisci il codice segreto per continuare.");
            return;
        }
        setLoading(true);
        try {
            const res = await reseedDemoData(token, secret);
            toast.success(
                `Rigenerati ${res.mesi.length} mesi di dati, ${res.n_ricorrenze} ricorrenze, ${res.n_snapshots} snapshot.`
            );
            setOpen(false);
            setSecret("");
        } catch (e: any) {
            toast.error(e.message || "Errore durante la rigenerazione dei dati demo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end text-center mt-6 mb-6">
            <button
                type="button"
                className="
                    flex items-center gap-2 px-4 py-2 rounded-xl border
                    border-primary/35 bg-primary/10 text-primary font-semibold
                    hover:bg-primary/15 hover:shadow-[0_0_16px_hsl(var(--c-primary)/0.25)]
                    focus:outline-none focus:ring-2 focus:ring-primary
                    active:scale-95 shadow transition-all duration-150
                "
                onClick={() => setOpen(true)}
            >
                <RotateCcw size={18} />
                Rigenera dati demo
            </button>

            <ConfirmDialog
                open={open}
                type="delete"
                title="Rigenera dati demo"
                message="I dati attuali (spese, entrate, ricorrenze e snapshot) verranno cancellati e sostituiti con un nuovo storico fittizio degli ultimi 12 mesi. L'azione è irreversibile."
                confirmLabel={loading ? "Rigenerazione..." : "Rigenera"}
                cancelLabel="Annulla"
                loading={loading}
                onConfirm={handleConfirm}
                onCancel={handleClose}
            >
                <Input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Codice segreto"
                    autoFocus
                />
            </ConfirmDialog>
        </div>
    );
}
