"use client";

/* ╔═════════════════════════════════════════════════════════╗
 * ║          PanoramicaPage: Calendario + Transazioni      ║
 * ╚═════════════════════════════════════════════════════════╝ */

/* ============================== */
/*         IMPORT PRINCIPALI      */
/* ============================== */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTransactions } from "@/hooks/useTransactions"; // GET transazioni
import { useTransactionsApi } from "@/hooks/useTransactionsApi"; // CUD transazioni
import { useCategories } from "@/hooks/useCategories"; // GET categorie
import TransactionsList from "./components/TransactionsList";
import CalendarGrid from "./components/CalendarGrid";
import CalendarGridSkeleton from "./components/skeleton/CalendarGridSkeleton";
import TransactionsListSkeleton from "./components/skeleton/TransactionsListSkeleton";
import TransactionDetailModal from "./components/modal/TransactionDetailModal";
import { Transaction } from "@/types";

/* ============================== */
/*         COMPONENTE             */
/* ============================== */
export default function PanoramicaPage() {
    // ───────────── SESSIONE UTENTE ─────────────
    const { data: session } = useSession();
    const token = session?.accessToken;

    // ───────────── DATI TRANSAZIONI (GET) ───────
    const { transactions: fetchedTransactions, loading, error } = useTransactions(token);

    // ───────────── STATO: Transazioni locali ─────
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    useEffect(() => {
        if (fetchedTransactions) setTransactions(fetchedTransactions);
    }, [fetchedTransactions]);

    // ───────────── DATI CATEGORIE (GET) ─────────
    const { categories, loading: catLoading, error: catError } = useCategories(token);

    // ───────────── STATO: Transazione selezionata ─────
    const [selected, setSelected] = useState<Transaction | null>(null);

    // ───────────── HOOK CUD Transazioni ──────────
    const { update, remove, status, error: apiError } = useTransactionsApi(token);

    // ───────────── HANDLER: Modifica transazione ─────
    async function handleEdit(t: Transaction) {
        const updated = await update(t);
        if (updated) {
            setTransactions((trs) => trs.map((tx) => (tx.id === updated.id ? updated : tx)));
            setSelected(updated);
        } else {
            alert("Errore nel salvataggio");
        }
    }

    // ───────────── HANDLER: Cancella transazione ─────
    async function handleDelete(t: Transaction) {
        if (confirm("Vuoi davvero eliminare questa transazione?")) {
            const ok = await remove(t);
            if (ok) {
                setTransactions((trs) => trs.filter((tx) => tx.id !== t.id));
                setSelected(null);
            } else {
                alert("Errore nella cancellazione");
            }
        }
    }

    // ============================== //
    //            RENDER              //
    // ============================== //
    return (
        <div className="space-y-6">
            {/* ======= TITOLO ======= */}
            <h1 className="text-2xl font-bold mb-4">📅 Riepilogo con Calendario</h1>

            {/* ======= CALENDARIO ======= */}
            {loading ? <CalendarGridSkeleton /> : <CalendarGrid transactions={transactions} />}

            {/* ======= LISTA TRANSAZIONI ======= */}
            {loading ? (
                <TransactionsListSkeleton />
            ) : (
                <TransactionsList transactions={transactions} onSelect={setSelected} categories={categories} />
            )}

            {/* ======= ERRORI ======= */}
            {(error || apiError) && <div className="p-4 text-danger text-sm">{error || apiError}</div>}

            {/* ======= MODALE DETTAGLIO TRANSAZIONE ======= */}
            {selected && (
                <TransactionDetailModal
                    transaction={selected}
                    onClose={() => setSelected(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    categories={categories}
                />
            )}

            {/* ======= STATO CATEGORIE ======= */}
            {(catLoading || catError) && (
                <div className="p-2 text-sm">
                    {catLoading ? "Categorie in caricamento..." : <span className="text-danger">{catError}</span>}
                </div>
            )}
        </div>
    );
}
