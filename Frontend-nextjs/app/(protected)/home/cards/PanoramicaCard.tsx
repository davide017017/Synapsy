// app/(protected)/home/cards/PanoramicaCard.tsx
// ======================================================================
// Card calendario Home mobile: striscia della settimana corrente,
// espandibile al mese intero (tap su "MESE" o swipe giù), con le
// statistiche transazioni in riga.
// ======================================================================

"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTransactions } from "@/context/TransactionsContext";
import { isThisWeek, isThisMonth, isThisYear } from "@/utils/date";
import type { UpcomingEntry } from "@/lib/api/upcomingApi";
import { HOME_CARD, HOME_SERIF, HOME_TITLE } from "../homeStyles";

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const DAY_INITIALS = ["L", "M", "M", "G", "V", "S", "D"];

const SWIPE_THRESHOLD = 40;

// e = entrate, s = spese, up = pagamento in arrivo
type Dot = { e: boolean; s: boolean; up: boolean };

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dotStyle({ e, s, up }: Dot): React.CSSProperties {
  if (up)
    return { background: "rgb(239 68 68)" };
  if (e && s)
    return { background: "linear-gradient(to right, hsl(var(--c-primary)) 50%, rgb(251 146 60) 50%)" };
  if (e)
    return { background: "hsl(var(--c-primary))" };
  return { background: "rgb(251 146 60)" };
}

export default function PanoramicaCard({ upcoming }: { upcoming: UpcomingEntry[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayKey = ymd(today);

  const { transactions, loading } = useTransactions();
  const [expanded, setExpanded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // ── Pallini per giorno (chiave YYYY-MM-DD: la settimana può scavalcare il mese) ──
  const dotMap = useMemo(() => {
    const map = new Map<string, Dot>();
    const get = (key: string) => map.get(key) ?? { e: false, s: false, up: false };
    for (const t of transactions) {
      if (!t.date) continue;
      const key = t.date.slice(0, 10);
      const entry = get(key);
      if (t.type === "entrata") entry.e = true;
      else entry.s = true;
      map.set(key, entry);
    }
    for (const u of upcoming) {
      const key = u.date.slice(0, 10);
      const entry = get(key);
      if (u.type === "spesa") entry.up = true;
      else entry.e = true;
      map.set(key, entry);
    }
    return map;
  }, [transactions, upcoming]);

  // ── Settimana corrente da lunedì ──
  const mondayDate = today.getDate() - ((today.getDay() + 6) % 7);
  const week = Array.from({ length: 7 }, (_, i) => new Date(year, month, mondayDate + i));

  // ── Mese corrente ──
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  // ── Statistiche transazioni (stessa logica di TransazioniCard) ──
  const stats = useMemo(() => ({
    totale: transactions.length,
    settimana: transactions.filter((t) => isThisWeek(t.date)).length,
    mese: transactions.filter((t) => isThisMonth(t.date)).length,
    anno: transactions.filter((t) => isThisYear(t.date)).length,
  }), [transactions]);

  // ── Swipe verticale: giù apre il mese, su lo richiude ──
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dy) < SWIPE_THRESHOLD || Math.abs(dy) < Math.abs(dx)) return;
    setExpanded(dy > 0);
  };

  const num = (n: number) => (
    <b className={`${HOME_SERIF} font-bold text-[hsl(var(--c-text))]`}>{loading ? "—" : n}</b>
  );

  return (
    <div className={`${HOME_CARD} flex flex-col gap-2`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={HOME_TITLE}>
          {MONTHS_IT[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="font-mono text-[10px] font-bold tracking-[.08em] uppercase text-primary"
        >
          Mese {expanded ? "▴" : "▾"}
        </button>
      </div>

      {/* Striscia settimana / mese intero: un solo blocco, così il pannello chiuso non aggiunge gap */}
      <div>
      {/* Striscia settimana (si chiude quando il mese è aperto) */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: expanded ? "0fr" : "1fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-7 gap-1">
            {week.map((d, i) => {
              const key = ymd(d);
              const isToday = key === todayKey;
              const dot = dotMap.get(key);
              return (
                <div
                  key={key}
                  className={[
                    "flex flex-col items-center rounded-[9px] border pt-1 pb-1.5",
                    isToday
                      ? "bg-[#173a2c] border-primary text-primary"
                      : "border-gray-200 dark:border-zinc-700",
                  ].join(" ")}
                >
                  <span className={`font-mono text-[9px] ${isToday ? "text-primary" : "text-gray-400"}`}>
                    {DAY_INITIALS[i]}
                  </span>
                  <span className={`${HOME_SERIF} text-[13px] font-bold leading-tight`}>{d.getDate()}</span>
                  <span className="w-1 h-1 mt-0.5 rounded-full" style={dot ? dotStyle(dot) : undefined} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mese intero (calendario attuale) */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-7 gap-y-0.5">
            {DAY_INITIALS.map((d, i) => (
              <span key={i} className="text-[10px] text-gray-400 text-center">
                {d}
              </span>
            ))}

            {cells.map((day, i) => {
              const key = day ? ymd(day) : null;
              const dot = key ? dotMap.get(key) : undefined;
              return (
                <div key={i} className="flex flex-col items-center gap-[1px]">
                  <span
                    className={[
                      "text-[10px] text-center w-5 h-5 flex items-center justify-center",
                      key === todayKey
                        ? "rounded-full bg-primary text-black font-semibold"
                        : "",
                    ].join(" ")}
                  >
                    {day?.getDate() ?? ""}
                  </span>
                  {dot ? (
                    <span className="w-1 h-1 rounded-full" style={dotStyle(dot)} />
                  ) : (
                    <span className="w-1 h-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Statistiche transazioni */}
      <Link href="/transazioni" className="text-[12px] text-gray-400">
        {num(stats.totale)} totali · {num(stats.settimana)} sett. · {num(stats.mese)} mese · {num(stats.anno)} anno
      </Link>
    </div>
  );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Calendario compatto della Home mobile. Mostra la settimana corrente da
// lunedì (oggi evidenziato) con un pallino per giorno: arancio = spese,
// verde = entrate, rosso = spesa in arrivo (da /upcoming, passato da
// HomePage). "MESE ▾" o swipe giù espandono il calendario mensile con
// animazione grid-template-rows 0fr→1fr (200ms). Sotto, conteggi
// transazioni come TransazioniCard; tap → /transazioni.
// ----------------------------------------------------------------------
