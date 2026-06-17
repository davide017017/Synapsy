import type { Transaction } from "@/types/models/transaction";

export type CalendarGridProps = {
    transactions: Transaction[];
    onDayClick?: (date: Date, transactions: Transaction[]) => void;
    viewMonth: number;
    viewYear: number;
    onMonthChange: (month: number, year: number) => void;
};

export * from "./calendar";

