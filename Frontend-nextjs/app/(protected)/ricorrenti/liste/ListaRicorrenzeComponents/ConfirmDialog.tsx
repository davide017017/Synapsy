// =======================================================
// ConfirmDialog.tsx
// Modale di conferma eliminazione ricorrenza
// =======================================================

type Props = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    nome: string;
};

// ============================
// COMPONENTE: Modale Conferma
// ============================
export default function ConfirmDialog({ open, onConfirm, onCancel, nome }: Props) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
            <div className="bg-bg-elevate p-6 rounded-xl shadow-xl border flex flex-col items-center gap-3">
                <span className="text-base text-center">
                    Vuoi davvero cancellare
                    <br />
                    <b>{nome}</b>?
                </span>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                        Sì, elimina
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-1 rounded border border-zinc-300 bg-bg hover:bg-bg-soft transition"
                    >
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================
// END ConfirmDialog.tsx
// ============================
