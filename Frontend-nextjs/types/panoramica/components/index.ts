import type { Transaction } from "@/types/models/transaction";

export type CalendarGridProps = {
    transactions: Transaction[];
    onDayClick?: (date: Date, transactions: Transaction[]) => void;
};

export * from "./calendar";
