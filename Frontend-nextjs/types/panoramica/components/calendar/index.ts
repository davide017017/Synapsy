import type { Transaction } from "@/types/models/transaction";
import type { Ricorrenza } from "@/types/models/ricorrenza";
import type { CalendarWeek } from "./utils";

export type DayCellProps = {
    day: number;
    date: Date;
    monthDelta: -1 | 0 | 1;
    transactions: Transaction[];
    showWeekDay?: boolean;
    onClickDay?: (date: Date, transactions: Transaction[], ricorrenze: Ricorrenza[]) => void;
    maxImporto: number;
    ricorrenzeDelGiorno?: Ricorrenza[];
};

export type WeekRowProps = {
    week: CalendarWeek;
    transactions: Transaction[];
    maxImporto: number;
    onClickDay?: (date: Date, transactions: Transaction[]) => void;
    ricorrenzePerGiorno?: Map<string, Ricorrenza[]>;
};

export type YearDropdownProps = {
    value: number;
    options: number[];
    onChange: (val: number) => void;
};

export * from "./utils";

