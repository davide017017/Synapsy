import { performance } from "node:perf_hooks";

interface Tx {
    date: Date;
    amount: number;
    category?: { type: "entrata" | "spesa" };
}

const generateTransactions = (count: number): Tx[] => {
    const txs: Tx[] = [];
    for (let i = 0; i < count; i++) {
        const day = (i % 28) + 1;
        txs.push({
            date: new Date(2024, 0, day),
            amount: i,
            category: { type: i % 2 ? "entrata" : "spesa" },
        });
    }
    return txs;
};

const cells = Array.from({ length: 31 }, (_, i) => ({ date: new Date(2024, 0, i + 1) }));
const transactions = generateTransactions(200_000);

const filterApproach = () => {
    return cells.map((c) =>
        transactions.filter(
            (tx) =>
                tx.date.getDate() === c.date.getDate() &&
                tx.date.getMonth() === c.date.getMonth() &&
                tx.date.getFullYear() === c.date.getFullYear()
        )
    );
};

const mapApproach = () => {
    const map = new Map<string, Tx[]>();
    const keyOf = (d: Date) => d.toISOString().split("T")[0];

    for (const tx of transactions) {
        const k = keyOf(tx.date);
        const arr = map.get(k);
        if (arr) arr.push(tx);
        else map.set(k, [tx]);
    }
    return cells.map((c) => map.get(keyOf(c.date)) ?? []);
};

const time = (label: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
};

time("filter", filterApproach);
time("map", mapApproach);
