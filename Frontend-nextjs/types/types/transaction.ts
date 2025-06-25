// types.ts
export type Transaction = {
    [x: string]: any;
    id: number;
    type: "entrata" | "uscita";
    description: string;
    amount: number;
    date: string;
};
