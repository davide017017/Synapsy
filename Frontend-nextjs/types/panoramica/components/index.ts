import type { Transaction } from "@/types/models/transaction";
import type { Ricorrenza } from "@/types/models/ricorrenza";

export type CalendarGridProps = {
    transactions: Transaction[];
    onDayClick?: (date: Date, transactions: Transaction[]) => void;
    viewMonth: number;
    viewYear: number;
    onMonthChange: (month: number, year: number) => void;
    ricorrenze?: Ricorrenza[];
};

export * from "./calendar";

