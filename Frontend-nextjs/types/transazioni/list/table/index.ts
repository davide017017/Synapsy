import type { Row } from "@tanstack/react-table";
import type { Transaction } from "@/types/types/transaction";

export type TransactionWithGroup = Transaction & { monthGroup: string };

export type TableRowProps = {
    row: Row<TransactionWithGroup>;
    onClick?: (t: TransactionWithGroup) => void;
    className?: string;
    selected?: boolean;
};

export type MonthDividerRowProps = {
    monthKey: string;
    colSpan: number;
    entrate?: number;
    spese?: number;
    saldo?: number;
    className?: string;
};

export type YearDividerRowProps = {
    year: string;
    colSpan: number;
    entrate?: number;
    spese?: number;
    saldo?: number;
    className?: string;
};

