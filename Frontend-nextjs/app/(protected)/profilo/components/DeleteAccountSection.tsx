"use client";

// ==========================
// DeleteAccountSection — Solo TailwindCSS (palette custom)
// ==========================

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import { Input } from "@/app/components/ui/Input";
import { deleteUserProfile } from "@/lib/api/userApi";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeleteAccountSection() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isDemo = session?.user?.email === "demo@synapsy.app";

    const handleDelete = async () => {
        if (!session?.accessToken) return;
        setLoading(true);
        try {
            await deleteUserProfile(session.accessToken as string, password);
            toast.success("Profilo disattivato. Potrai recuperarlo entro 30 giorni.");
            router.replace("/login");
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione profilo");
        } finally {
            setLoading(false);
        }
    };

    if (isDemo) {
        return (
            <p className="text-center text-sm text-muted-foreground mt-6 mb-6">
                {"L'utente demo non può eliminare il profilo."}
            </p>
        );
    }

    return (
        <div className="flex justify-end text-center mt-6 mb-6">
            <button
                type="button"
                className="
                    flex items-center gap-2 px-4 py-2 rounded-xl border
                    border-danger-dark bg-danger text-text-invert font-semibold
                    hover:bg-danger-dark hover:scale-110 hover:text-white
                    focus:outline-none focus:ring-2 focus:ring-danger-dark
                    active:scale-95 shadow transition-all duration-150 group
                "
                onClick={() => setOpen(true)}
            >
                <Trash2 size={18} className="text-invert group-hover:animate-shake" />
                Elimina profilo
            </button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <ModalLayout title="Conferma eliminazione" onClose={() => setOpen(false)}>
                    <p className="text-sm mb-2 text-text-secondary">
                        Inserisci la tua password per confermare. Potrai recuperare il profilo entro 30 giorni.
                    </p>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="mb-4"
                    />
                    <div className="flex justify-end gap-2">
                        {/* ──────────────── Bottone Annulla ──────────────── */}
                        <button
                            type="button"
                            className="
                                px-4 py-1 rounded-xl font-medium border
                                bg-bg-soft text-text-secondary border-secondary
                                hover:bg-bg-alt hover:text-text
                                focus:outline-none focus:ring-2 focus:ring-primary
                                transition
                                disabled:opacity-60
                            "
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Annulla
                        </button>
                        {/* ──────────────── Bottone Elimina ──────────────── */}
                        <button
                            type="button"
                            className="
                                px-4 py-1 rounded-xl font-medium border
                                bg-danger text-text-invert border-danger-dark
                                hover:bg-danger-dark hover:text-white
                                focus:outline-none focus:ring-2 focus:ring-primary
                                transition
                                disabled:opacity-60
                            "
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Elimino..." : "Elimina"}
                        </button>
                    </div>
                </ModalLayout>
            </Dialog>
        </div>
    );
}
