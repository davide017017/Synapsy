// ================================
// TransactionDeleteConfirmModal.tsx
// ================================
import { AlertTriangle } from "lucide-react";

type Props = {
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
};

export default function TransactionDeleteConfirmModal({ onConfirm, onCancel, loading }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-xs w-full flex flex-col items-center border border-red-300 shadow-xl">
                <AlertTriangle className="text-red-600 mb-2" size={36} />
                <div className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 text-center">
                    Confermi di voler eliminare la transazione?
                </div>
                <div className="flex gap-4 mt-2">
                    <button
                        className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        Sì, elimina
                    </button>
                    <button
                        className="px-6 py-2 rounded-xl bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-400 dark:hover:bg-zinc-800"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    );
}
