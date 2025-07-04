"use client";

// ============================
// NewRicorrenzaModal.tsx
// Modale riusabile per create/edit
// ============================

import NewRicorrenzaForm from "./NewRicorrenzaForm";
import { Ricorrenza, RicorrenzaBase } from "@/types/types/ricorrenza";
// Sostituisci con il tuo Dialog preferito!
import Dialog from "@/app/components/ui/Dialog";

type Props = {
    open: boolean;
    onClose: () => void;
    ricorrenzaToEdit?: Ricorrenza | null;
    onSave: (data: RicorrenzaBase) => Promise<void>;
};

export default function NewRicorrenzaModal({ open, onClose, ricorrenzaToEdit, onSave }: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <div className="p-6 min-w-[320px] max-w-[430px]">
                <h2 className="text-xl font-bold mb-4">
                    {ricorrenzaToEdit ? "Modifica ricorrenza" : "Nuova ricorrenza"}
                </h2>
                <NewRicorrenzaForm initialValues={ricorrenzaToEdit || undefined} onSave={onSave} onCancel={onClose} />
            </div>
        </Dialog>
    );
}

// ============================
// END NewRicorrenzaModal.tsx
// ============================
