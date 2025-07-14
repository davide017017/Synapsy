"use client";
// =========================================
// ConfirmDialog.tsx — Dialog conferma eliminazione uniforme
// =========================================
import { AlertTriangle } from "lucide-react";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";

type Props = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
    title?: string;
    loading?: boolean;
};

export default function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    message,
    title = "Conferma eliminazione",
    loading = false,
}: Props) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <ModalLayout
                title={
                    <span className="flex items-center gap-2 text-danger">
                        <AlertTriangle size={20} />
                        {title}
                    </span>
                }
                onClose={onCancel}
                footer={
                    <>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                        >
                            Sì, elimina
                        </button>
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-400 dark:hover:bg-zinc-800"
                        >
                            Annulla
                        </button>
                    </>
                }
            >
                <div className="text-base text-center">{message}</div>
            </ModalLayout>
        </Dialog>
    );
}
