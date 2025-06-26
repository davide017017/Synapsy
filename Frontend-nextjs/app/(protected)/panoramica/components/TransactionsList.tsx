import { useState } from "react";
import { Transaction } from "@/types/types/transaction";
import TransactionListFilter from "./list/TransactionListFilter";
import TransactionTable from "./list/TransactionTable";
import { useSelection } from "@/context/contexts/SelectionContext";

type Props = {
    transactions: Transaction[];
    onSelect: (t: Transaction) => void;
    categories?: { name: string; id: number; type: string }[];
    selectedId?: number | null;
};

export default function TransactionsList({ transactions, onSelect, categories = [], selectedId }: Props) {
    // ---- Usa il context invece delle prop ----
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();
    // Stato filtro frontend
    const [filter, setFilter] = useState({
        search: "",
        type: "tutti",
        category: "tutte",
    });

    // Applica filtro locale
    const filtered = transactions.filter((t) => {
        const matchType = filter.type === "tutti" || t.category?.type === filter.type;
        const matchCategory = filter.category === "tutte" || String(t.category?.id) === filter.category;
        const matchSearch = t.description.toLowerCase().includes(filter.search.toLowerCase());
        return matchType && matchCategory && matchSearch;
    });

    // Render
    if (!transactions.length) return <p className="text-muted text-sm">Nessuna transazione trovata.</p>;

    return (
        <div className="flex gap-4 items-start w-full">
            {/* Tabella a sinistra */}
            <div className="flex-1 min-w-0">
                <TransactionTable data={filtered} onRowClick={onSelect} selectedId={selectedId} />
            </div>
            {/* Filtro a destra */}
            <div className="w-64 flex-shrink-0">
                <TransactionListFilter filter={filter} setFilter={setFilter} categories={categories} />
            </div>
        </div>
    );
}
