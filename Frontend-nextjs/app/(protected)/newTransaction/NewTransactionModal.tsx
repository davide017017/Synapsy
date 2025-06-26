"use client";

import Dialog from "@/app/components/ui/Dialog";
import NewTransactionForm from "./NewTransactionForm";
import { useNewTransaction } from "@/context/contexts/NewTransactionContext";

export default function NewTransactionModal() {
    const { isOpen, close, handleSave } = useNewTransaction();

    return (
        <Dialog open={isOpen} onClose={close} title="Aggiungi Transazione">
            <NewTransactionForm onSave={handleSave} />
        </Dialog>
    );
}
