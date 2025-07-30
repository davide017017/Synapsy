// ====================================================
// TransactionsList.tsx
// Lista transazioni con filtro e tabella — uniformata
// ====================================================

import { useState, useMemo, useEffect } from "react";
import TransactionListFilter from "./list/TransactionListFilter";
import TransactionTable from "./list/TransactionTable";
import { useSelection } from "@/context/contexts/SelectionContext";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { Funnel, Search, Tag } from "lucide-react"; // icone esempio
import type { TransactionsListProps } from "@/types/transazioni/list";

// ----------------------------------------------
// Componente principale lista + filtro + tabella
// ----------------------------------------------
export default function TransactionsList({ transactions, onSelect, selectedId }: TransactionsListProps) {
    // ===== Stato filtro frontend =====
    const [filter, setFilter] = useState({
        search: "",
        type: "tutti",
        category: "tutte",
    });

    const { categories } = useCategories();
    const { isSelectionMode, selectedIds, setSelectedIds } = useSelection();
    const [visible, setVisible] = useState(20);

    // ===== Filtro transazioni =====
    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const matchType = filter.type === "tutti" || t.category?.type === filter.type;
            const matchCategory = filter.category === "tutte" || String(t.category?.id) === filter.category;
            const matchSearch = t.description.toLowerCase().includes(filter.search.toLowerCase());
            return matchType && matchCategory && matchSearch;
        });
    }, [transactions, filter]);

    useEffect(() => {
        setVisible(20);
    }, [filter, transactions]);

    // ===== Render Vuoto =====
    if (!transactions.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground text-sm py-8">
                Nessuna transazione trovata.
                <br />
                <span className="opacity-80">Vuoi crearne una?</span>
            </div>
        );
    }

    // ===== Render Responsive =====
    return (
        <div className="flex flex-col lg:flex-row gap-4 w-full">
            {/* ====== Filtro (mobile sopra, desktop a lato) ====== */}
            <div className="lg:w-64 w-full flex-shrink-0 mb-2 lg:mb-0">
                <TransactionListFilter
                    filter={filter}
                    setFilter={setFilter}
                    categories={categories}
                    // icone esempio (passa come prop se vuoi customizzare)
                    iconSearch={<Search size={16} className="text-primary" />}
                    iconType={<Funnel size={16} className="text-secondary" />}
                    iconCategory={<Tag size={16} className="text-accent" />}
                />
            </div>
            {/* ====== Tabella ====== */}
            <div className="flex-1 min-w-0">
                <TransactionTable
                    data={filtered.slice(0, visible)}
                    onRowClick={onSelect}
                    selectedId={selectedId}
                    isSelectionMode={isSelectionMode}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                />
                {visible < filtered.length ? (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setVisible((v) => v + 20)}
                            className="px-3 py-1 rounded bg-primary text-white text-sm"
                        >
                            Carica altre transazioni
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Hai visualizzato tutte le transazioni.
                    </div>
                )
            </div>
        </div>
    );
}
