"use client";
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

    return (
        <div className="flex justify-center text-center mt-6">
            <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400 text-white font-semibold bg-red-700 hover:bg-white hover:text-red-700 hover:scale-110 active:scale-95 shadow transition-all duration-150 cursor-pointer group"
                onClick={() => setOpen(true)}
            >
                <Trash2 size={18} className="text:white hover:text-red-500 group-hover:animate-shake" />
                Elimina profilo
            </button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <ModalLayout title="Conferma eliminazione" onClose={() => setOpen(false)}>
                    <p className="text-sm mb-2">
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
                        <button
                            className="px-3 py-1 rounded bg-gray-200"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Annulla
                        </button>
                        <button
                            className="px-3 py-1 rounded bg-red-600 text-white"
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
