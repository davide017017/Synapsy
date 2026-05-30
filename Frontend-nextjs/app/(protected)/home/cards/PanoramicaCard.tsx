"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTransactions } from "@/context/TransactionsContext";

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const DAY_INITIALS = ["L", "M", "M", "G", "V", "S", "D"];

function dotStyle(e: boolean, s: boolean): React.CSSProperties {
  if (e && s)
    return { background: "linear-gradient(to right, hsl(var(--c-primary)) 50%, rgb(251 146 60) 50%)" };
  if (e)
    return { background: "hsl(var(--c-primary))" };
  return { background: "rgb(251 146 60)" };
}

export default function PanoramicaCard() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const { transactions } = useTransactions();

  const dotMap = useMemo(() => {
    const map = new Map<number, { e: boolean; s: boolean }>();
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    for (const t of transactions) {
      if (!t.date?.startsWith(prefix)) continue;
      const day = parseInt(t.date.slice(8, 10), 10);
      const entry = map.get(day) ?? { e: false, s: false };
      if (t.type === "entrata") entry.e = true;
      else entry.s = true;
      map.set(day, entry);
    }
    return map;
  }, [transactions, year, month]);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const offset = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Link href="/panoramica" className="contents">
      <div className="flex flex-col gap-2 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-[hsl(var(--c-bg))] shadow-black shadow-lg cursor-pointer hover:shadow-black hover:shadow-2xl hover:bg-primary/10 active:shadow-md active:scale-[.98] transition-all duration-150">
        <span className="text-xs font-semibold text-primary">
          {MONTHS_IT[month]} {year}
        </span>

        <div className="grid grid-cols-7 gap-y-0.5">
          {DAY_INITIALS.map((d, i) => (
            <span key={i} className="text-[10px] text-gray-400 text-center">
              {d}
            </span>
          ))}

          {cells.map((day, i) => {
            const dot = day ? dotMap.get(day) : undefined;
            return (
              <div key={i} className="flex flex-col items-center gap-[1px]">
                <span
                  className={[
                    "text-[10px] text-center w-5 h-5 flex items-center justify-center",
                    day === todayDate
                      ? "rounded-full bg-primary text-black font-semibold"
                      : "",
                  ].join(" ")}
                >
                  {day ?? ""}
                </span>
                {dot ? (
                  <span className="w-1 h-1 rounded-full" style={dotStyle(dot.e, dot.s)} />
                ) : (
                  <span className="w-1 h-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
}
