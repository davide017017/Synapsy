"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useTransactions } from "@/context/TransactionsContext";
import { toNum } from "@/lib/finance";

const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

type MonthData = {
    label: string;
    entrate: number;
    spese: number;
};

export default function UltimiMesiCard() {
    const { transactions } = useTransactions();

    const monthData = useMemo<MonthData[]>(() => {
        const today = new Date();
        const months: { year: number; month: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({ year: d.getFullYear(), month: d.getMonth() });
        }

        return months.map(({ year, month }) => {
            let entrate = 0;
            let spese = 0;
            for (const t of transactions) {
                const [y, m] = t.date.split("-").map(Number);
                if (y !== year || m - 1 !== month) continue;
                const amt = Math.abs(toNum(t.amount));
                if (t.category?.type === "entrata") entrate += amt;
                else if (t.category?.type === "spesa") spese += amt;
            }
            return { label: MONTHS_IT[month], entrate, spese };
        });
    }, [transactions]);

    return (
        <DashboardCard icon={<TrendingUp size={20} />} title="Ultimi 6 mesi">
            <ResponsiveContainer width="100%" height={120}>
                <BarChart data={monthData} barSize={8} barGap={2} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "hsl(var(--foreground) / 0.5)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--foreground)/0.1)",
                            borderRadius: 8,
                            fontSize: 11,
                        }}
                        formatter={(value) => [`${Number(value).toFixed(0)} €`]}
                    />
                    <Bar dataKey="entrate" fill="hsl(var(--c-primary))" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="spese" fill="rgb(251 146 60)" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-3 mt-1 justify-center">
                <span className="flex items-center gap-1 text-[10px] font-mono text-primary">
                    <span className="w-2 h-2 rounded-sm bg-primary inline-block" /> Entrate
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-orange-400">
                    <span className="w-2 h-2 rounded-sm bg-orange-400 inline-block" /> Spese
                </span>
            </div>
        </DashboardCard>
    );
}
