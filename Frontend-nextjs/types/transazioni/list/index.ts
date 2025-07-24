import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { Transaction } from "@/types/types/transaction";

export type TransactionsListProps = {
    transactions: Transaction[];
    onSelect: (t: Transaction) => void;
    selectedId?: number | null;
};

export type Filter = {
    search: string;
    type: string;
    category: string;
};

export type Category = {
    name: string;
    id: number;
    type: string;
};

export type TransactionListFilterProps = {
    filter: Filter;
    setFilter: (f: Filter) => void;
    categories: Category[];
    iconSearch?: ReactNode;
    iconType?: ReactNode;
    iconCategory?: ReactNode;
};

export type TransactionTableProps = {
    data: Transaction[];
    onRowClick: (t: Transaction) => void;
    selectedId?: number | null;
    isSelectionMode?: boolean;
    selectedIds?: number[];
    setSelectedIds?: Dispatch<SetStateAction<number[]>>;
};

export type SelectionToolbarProps = {
    onDeleteSelected: (ids: number[]) => void;
};

export * from "./table";

