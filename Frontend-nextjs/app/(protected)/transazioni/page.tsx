"use client";

// ==============================================
// Pagina principale lista transazioni — CRUD sync
// ==============================================

import { useEffect, useState, Suspense } from "react";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { useCategories } from "@/context/contexts/CategoriesContext";
import SelectionToolbar from "./components/SelectionToolbar";
import dynamic from "next/dynamic";
import TransactionsListSkeleton from "./skeleton/TransactionsListSkeleton";
const TransactionsList = dynamic(() => import("./components/TransactionsList"), { suspense: true });
import TransactionDetailModal from "./modal/TransactionDetailModal";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import { Transaction } from "@/types/models/transaction";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import { Loader2 } from "lucide-react";

// ----------------------------------------------
// Componente principale pagina transazioni
// ----------------------------------------------
export default function TransazioniPage() {
    const { transactions, loading, error, fetchAll, update, remove } = useTransactions();
    const { categories } = useCategories();
    const [selected, setSelected] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Carica lista al mount
    useEffect(() => {
        fetchAll();
    }, []);

    // Handler modifica transazione
    const handleEdit = async (tx: Transaction) => {
        setSelected(null);
        setIsLoading(true);
        await update(tx.id, tx);
        setIsLoading(false);
    };

    // Handler elimina singola transazione
    const handleDelete = async (tx: Transaction) => {
        setSelected(null);
        setIsLoading(true);
        await remove(tx.id);
        setIsLoading(false);
    };

    // Handler elimina selezione multipla
    const handleDeleteSelectedTransactions = async (ids: number[]) => {
        setIsLoading(true);
        for (const id of ids) await remove(id);
        setIsLoading(false);
    };

    const selectedTx = transactions.find((tx) => tx.id === selected);

    // ----------------------------------------------
    // Render
    // ----------------------------------------------
    return (
        <div className="space-y-5">
            {/* ===================== Header compatto/minimal ===================== */}
            {/* ----------- Blocco superiore con sfondo ----------- */}
            <div className="relative rounded-2xl border border-bg-elevate bg-bg-elevate/60 backdrop-blur-sm p-6 shadow-md overflow-hidden animate-fade-in">
                {/* -------- Icona sfumata di sfondo -------- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Puoi cambiare l'icona se vuoi: es. CreditCard, Table, ecc */}
                    <svg
                        className="w-[180px] h-[180px] text-[hsl(var(--c-secondary))] opacity-5"
                        style={{ filter: "blur(2px)" }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" />
                    </svg>
                </div>

                {/* -------- Titolo e descrizione -------- */}
                <div className="relative z-10 text-center max-w-xl mx-auto space-y-2">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold flex justify-center items-center gap-3 text-[hsl(var(--c-primary-dark))] drop-shadow-sm">
                        {/* Sostituisci con una icona lucide-react a tema transazioni */}
                        <span className="inline-block w-7 h-7 text-[hsl(var(--c-primary))]">
                            {/* Esempio: icona carta di credito */}
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-7 h-7"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                        <span>Transazioni</span>
                    </h1>
                    <p className="text-sm text-[hsl(var(--c-text-secondary))]">
                        Tieni traccia in modo ordinato delle tue entrate e spese giornaliere.
                    </p>
                </div>

                {/* -------- Pulsante -------- */}
                <div className="relative z-10 mt-4 flex justify-center">
                    <NewTransactionButton />
                </div>
            </div>

            {/* ===================== /Header ===================== */}

            {/* ===================== Lista ====================== */}
            {loading ? (
                <TransactionsListSkeleton />
            ) : (
                <Suspense fallback={<TransactionsListSkeleton />}>
                    <>
                        <SelectionToolbar onDeleteSelected={handleDeleteSelectedTransactions} />
                        <TransactionsList
                            transactions={transactions}
                            onSelect={(tx) => setSelected(tx.id)}
                            selectedId={selected}
                        />
                    </>
                </Suspense>
            )}
            {/* ===================== /Lista ===================== */}

            {/* ===================== Error ====================== */}
            {error && <div className="p-4 text-danger text-sm">{error}</div>}
            {/* ===================== /Error ===================== */}

            {/* =================== Modale Dettaglio ============== */}
            {selectedTx && (
                <TransactionDetailModal
                    transaction={selectedTx}
                    onClose={() => setSelected(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    categories={categories}
                />
            )}
            {/* =============== /Modale Dettaglio ================= */}

            {/* ============== Spinner full screen ================ */}

            {isLoading && (
                <LoadingOverlay
                    show={true}
                    fixed
                    rounded={false}
                    message="Sto aggiornando!"
                    subMessage="Attendi un istante…"
                    icon={<Loader2 className="animate-spin" size={40} />}
                />
            )}
            {/* ============ /Spinner full screen ================= */}
        </div>
    );
}

