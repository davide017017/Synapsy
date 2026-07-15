"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
    const [chartType, setChartType] = useState<"bar" | "line">("bar");

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
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary opacity-80" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                        Ultimi 6 mesi
                    </span>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-white/10 p-0.5">
                    <button
                        onClick={() => setChartType("bar")}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            chartType === "bar"
                                ? "bg-white/10 text-white"
                                : "text-white/30 hover:text-white/60"
                        }`}
                        aria-label="Istogramma"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <rect x="1" y="6" width="3" height="7" rx="0.5" />
                            <rect x="5.5" y="3" width="3" height="10" rx="0.5" />
                            <rect x="10" y="1" width="3" height="12" rx="0.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setChartType("line")}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            chartType === "line"
                                ? "bg-white/10 text-white"
                                : "text-white/30 hover:text-white/60"
                        }`}
                        aria-label="Linee"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1,11 4,7 7,9 10,4 13,2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Chart ── */}
            <ResponsiveContainer width="100%" height={160}>
                {chartType === "bar" ? (
                    <BarChart
                        data={monthData}
                        barSize={12}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
                                padding: "8px 12px",
                            }}
                            labelStyle={{ color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontSize: "11px" }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;
                                const entrate = Number(payload.find(p => p.dataKey === "entrate")?.value ?? 0);
                                const spese = Number(payload.find(p => p.dataKey === "spese")?.value ?? 0);
                                const netto = entrate - spese;
                                const isPositive = netto >= 0;
                                return (
                                    <div style={{
                                        background: "rgba(0,0,0,0.85)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        color: "#fff",
                                        padding: "8px 12px",
                                    }}>
                                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "6px" }}>{label}</div>
                                        <div style={{ color: "hsl(var(--c-primary))", marginBottom: "2px" }}>↑ € {entrate.toFixed(2)}</div>
                                        <div style={{ color: "rgb(251 146 60)", marginBottom: "6px" }}>↓ € {spese.toFixed(2)}</div>
                                        <div style={{
                                            borderTop: "1px solid rgba(255,255,255,0.08)",
                                            paddingTop: "6px",
                                            color: isPositive ? "rgb(52 211 153)" : "rgb(248 113 113)",
                                            fontWeight: "bold",
                                        }}>
                                            {isPositive ? "+" : ""}€ {netto.toFixed(2)}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Bar dataKey="entrate" name="Entrate" fill="hsl(var(--c-primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spese"   name="Spese"   fill="rgb(251 146 60)"        radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : (
                    <LineChart
                        data={monthData}
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
                            width={48}
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
                                padding: "8px 12px",
                            }}
                            labelStyle={{ color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontSize: "11px" }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;
                                const entrate = Number(payload.find(p => p.dataKey === "entrate")?.value ?? 0);
                                const spese = Number(payload.find(p => p.dataKey === "spese")?.value ?? 0);
                                const netto = entrate - spese;
                                const isPositive = netto >= 0;
                                return (
                                    <div style={{
                                        background: "rgba(0,0,0,0.85)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        color: "#fff",
                                        padding: "8px 12px",
                                    }}>
                                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "6px" }}>{label}</div>
                                        <div style={{ color: "hsl(var(--c-primary))", marginBottom: "2px" }}>↑ € {entrate.toFixed(2)}</div>
                                        <div style={{ color: "rgb(251 146 60)", marginBottom: "6px" }}>↓ € {spese.toFixed(2)}</div>
                                        <div style={{
                                            borderTop: "1px solid rgba(255,255,255,0.08)",
                                            paddingTop: "6px",
                                            color: isPositive ? "rgb(52 211 153)" : "rgb(248 113 113)",
                                            fontWeight: "bold",
                                        }}>
                                            {isPositive ? "+" : ""}€ {netto.toFixed(2)}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Line
                            dataKey="entrate"
                            name="Entrate"
                            type="monotone"
                            stroke="hsl(var(--c-primary))"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "hsl(var(--c-primary))", strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            dataKey="spese"
                            name="Spese"
                            type="monotone"
                            stroke="rgb(251 146 60)"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "rgb(251 146 60)", strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                )}
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
