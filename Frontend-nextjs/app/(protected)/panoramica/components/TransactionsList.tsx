// ============================
// TransactionsList.tsx
// Lista transazioni con filtro e tabella — tutto uniformato
// ============================

import { useState, useMemo } from "react";
import { Transaction } from "@/types/types/transaction";
import TransactionListFilter from "./list/TransactionListFilter";
import TransactionTable from "./list/TransactionTable";
import { useSelection } from "@/context/contexts/SelectionContext";
import { useCategories } from "@/context/contexts/CategoriesContext";

type Props = {
    transactions: Transaction[];
    onSelect: (t: Transaction) => void;
    selectedId?: number | null;
    // Niente più prop categories: si usano dal context
};

export default function TransactionsList({ transactions, onSelect, selectedId }: Props) {
    // Stato filtro frontend (locale)
    const [filter, setFilter] = useState({
        search: "",
        type: "tutti",
        category: "tutte",
    });

    // ---- Usa il context categorie ----
    const { categories } = useCategories();
    // ---- Usa il context selezione ----
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();

    // Filtro transazioni
    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const matchType = filter.type === "tutti" || t.category?.type === filter.type;
            const matchCategory = filter.category === "tutte" || String(t.category?.id) === filter.category;
            const matchSearch = t.description.toLowerCase().includes(filter.search.toLowerCase());
            return matchType && matchCategory && matchSearch;
        });
    }, [transactions, filter]);

    // Render
    if (!transactions.length) {
        return <p className="text-muted text-sm">Nessuna transazione trovata.</p>;
    }

    return (
        <div className="flex gap-4 items-start w-full">
            {/* Tabella transazioni */}
            <div className="flex-1 min-w-0">
                <TransactionTable
                    data={filtered}
                    onRowClick={onSelect}
                    selectedId={selectedId}
                    // puoi aggiungere isSelectionMode, selectedIds, setSelectedIds se la tabella gestisce la selezione multipla
                />
            </div>
            {/* Filtro */}
            <div className="w-64 flex-shrink-0">
                <TransactionListFilter filter={filter} setFilter={setFilter} categories={categories} />
            </div>
        </div>
    );
}
