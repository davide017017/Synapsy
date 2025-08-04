export type CalendarCell = {
    day: number;
    monthDelta: -1 | 0 | 1;
    date: Date;
};

export type CalendarWeek = {
    weekNumber: number;
    days: CalendarCell[];
};

export type CalendarOptions = {
    withWeekNumbers?: boolean;
};

