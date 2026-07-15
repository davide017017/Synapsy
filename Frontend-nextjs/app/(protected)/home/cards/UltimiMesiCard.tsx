"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
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
        <div className="
            w-full rounded-xl
            border border-white/8
            bg-black/40 backdrop-blur-sm
            p-4
            font-mono
        ">
            {/* ── Header ── */}
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-primary opacity-80" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                    Ultimi 6 mesi
                </span>
            </div>

            {/* ── Chart ── */}
            <ResponsiveContainer width="100%" height={160}>
                <BarChart
                    data={monthData}
                    barSize={12}
                    barGap={3}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "monospace" }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }}
                        width={36}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={{
                            background: "rgba(0,0,0,0.85)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            color: "#fff",
                        }}
                        formatter={(value) => [`€ ${Number(value).toFixed(2)}`, undefined]}
                        labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}
                    />
                    <Bar dataKey="entrate" name="Entrate" fill="hsl(var(--c-primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spese"   name="Spese"   fill="rgb(251 146 60)"        radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            {/* ── Legend ── */}
            <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />
                    <span className="text-[11px] text-white/50 font-mono">Entrate</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-400" />
                    <span className="text-[11px] text-white/50 font-mono">Spese</span>
                </div>
            </div>
        </div>
    );
}
