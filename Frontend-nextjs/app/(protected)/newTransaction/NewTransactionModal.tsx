"use client";

/* ╔══════════════════════════════════════════════════════╗
 * ║         NewTransactionModal — Modale unica           ║
 * ╚══════════════════════════════════════════════════════╝ */

import Dialog from "@/app/components/ui/Dialog";
import NewTransactionForm from "./NewTransactionForm";
import { useTransactions } from "@/context/contexts/TransactionsContext";

// ============================
// Modale globale per transazioni (create/edit)
// ============================
export default function NewTransactionModal() {
    const { isOpen, closeModal, transactionToEdit, create, update } = useTransactions();

    // Handler: salva (crea o aggiorna)
    const handleSave = (data: any) => {
        if (transactionToEdit) update(transactionToEdit.id, data);
        else create(data);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeModal}
            title={transactionToEdit ? "Modifica Transazione" : "Aggiungi Transazione"}
        >
            <NewTransactionForm onSave={handleSave} transaction={transactionToEdit ?? undefined} />
        </Dialog>
    );
}
