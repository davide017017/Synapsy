import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { Transaction } from "@/types/models/transaction";

export type TransactionsListProps = {
    transactions: Transaction[];
    selectedId: string | null;
    onSelect: (tx: Transaction) => void;
    onDeleteSelected: (ids: string[]) => Promise<void>;
};

export type Filter = {
    search: string;
    type: string;
    category: string;
};

export type TxCategory = {
    name: string;
    id: number;
    type: string;
};

export type TransactionListFilterProps = {
    filter: Filter;
    setFilter: (f: Filter) => void;
    categories: TxCategory[];
    iconSearch?: ReactNode;
    iconType?: ReactNode;
    iconCategory?: ReactNode;
};

export type TransactionTableProps = {
    data: Transaction[];
    onRowClick: (t: Transaction) => void;
    isSelectionMode?: boolean;
    selectedId?: string | null;
    selectedIds?: string[];
    setSelectedIds?: Dispatch<SetStateAction<string[]>>;
};

export type SelectedPreviewItem = {
    id: number;
    description: string;
    amount: number;
    date: string;
};

export type SelectionToolbarProps = {
    onDeleteSelected: (ids: string[]) => Promise<void>;
    selectedPreview?: SelectedPreviewItem[];
};

export * from "./table";
