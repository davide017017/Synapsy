import type { Transaction } from "@/types/models/transaction";
import type { CalendarWeek } from "./utils";

export type DayCellProps = {
    day: number;
    date: Date;
    monthDelta: -1 | 0 | 1;
    transactions: Transaction[];
    showWeekDay?: boolean;
    onClickDay?: (date: Date, transactions: Transaction[]) => void;
    maxImporto: number;
};

export type WeekRowProps = {
    week: CalendarWeek;
    transactions: Transaction[];
    maxImporto: number;
};

export type YearDropdownProps = {
    value: number;
    options: number[];
    onChange: (val: number) => void;
};

export * from "./utils";
