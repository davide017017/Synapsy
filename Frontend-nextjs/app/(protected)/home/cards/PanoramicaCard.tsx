// app/(protected)/home/cards/PanoramicaCard.tsx
// ======================================================================
// Card calendario Home mobile: striscia della settimana corrente,
// espandibile al mese intero (tap su "MESE" o swipe giù), con le
// statistiche transazioni in griglia. Tap su un giorno → modale giorno.
// ======================================================================

"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTransactions } from "@/context/TransactionsContext";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { isThisWeek, isThisMonth, isThisYear, localDateKey, anyToLocalKey } from "@/utils/date";
import { buildRicorrenzeMap } from "@/utils/ricorrenzeCalendar";
import DayTransactionsModal from "@/app/components/modal/DayTransactionsModal";
import type { Transaction } from "@/types/models/transaction";
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
  const todayKey = localDateKey(today);

  const { transactions, loading } = useTransactions();
  const { ricorrenze } = useRicorrenze();
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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

  // ── Transazioni per giorno (stessa chiave locale di Panoramica/CalendarGrid) ──
  const txByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of transactions) {
      if (!t.date) continue;
      const key = anyToLocalKey(t.date);
      const arr = map.get(key);
      if (arr) arr.push(t);
      else map.set(key, [t]);
    }
    return map;
  }, [transactions]);

  // ── Ricorrenze previste: settimana + mese visibili (la settimana può scavalcare il mese) ──
  const ricorrenzeMap = useMemo(() => {
    const from = new Date(Math.min(new Date(year, month, mondayDate).getTime(), new Date(year, month, 1).getTime()));
    const to = new Date(Math.max(new Date(year, month, mondayDate + 6).getTime(), new Date(year, month + 1, 0).getTime()));
    return buildRicorrenzeMap(ricorrenze, from, to);
  }, [ricorrenze, year, month, mondayDate]);

  // ── Pallini per giorno (chiave YYYY-MM-DD locale, come la modale) ──
  const dotMap = useMemo(() => {
    const map = new Map<string, Dot>();
    const get = (key: string) => map.get(key) ?? { e: false, s: false, up: false };
    for (const [key, txs] of txByDate) {
      const entry = get(key);
      for (const t of txs) {
        if (t.type === "entrata") entry.e = true;
        else entry.s = true;
      }
      map.set(key, entry);
    }
    for (const u of upcoming) {
      const key = anyToLocalKey(u.date);
      const entry = get(key);
      if (u.type === "spesa") entry.up = true;
      else entry.e = true;
      map.set(key, entry);
    }
    return map;
  }, [txByDate, upcoming]);

  // ── Statistiche transazioni (stessa logica di TransazioniCard) ──
  const stats = useMemo(() => [
    { label: "totali", value: transactions.length },
    { label: "sett.", value: transactions.filter((t) => isThisWeek(t.date)).length },
    { label: "mese", value: transactions.filter((t) => isThisMonth(t.date)).length },
    { label: "anno", value: transactions.filter((t) => isThisYear(t.date)).length },
  ], [transactions]);

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

  const selectedKey = selectedDate ? localDateKey(selectedDate) : "";

  return (
    <>
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
                  const key = localDateKey(d);
                  const isToday = key === todayKey;
                  const dot = dotMap.get(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setSelectedDate(d)}
                      tabIndex={expanded ? -1 : 0}
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
                    </button>
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
                  if (!day) return <div key={i} />;
                  const key = localDateKey(day);
                  const dot = dotMap.get(key);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      tabIndex={expanded ? 0 : -1}
                      className="flex flex-col items-center gap-[1px]"
                    >
                      <span
                        className={[
                          "text-[10px] text-center w-5 h-5 flex items-center justify-center",
                          key === todayKey
                            ? "rounded-full bg-primary text-black font-semibold"
                            : "",
                        ].join(" ")}
                      >
                        {day.getDate()}
                      </span>
                      {dot ? (
                        <span className="w-1 h-1 rounded-full" style={dotStyle(dot)} />
                      ) : (
                        <span className="w-1 h-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiche transazioni: una riga, 4 voci distribuite, contatore "tech" + etichetta accanto */}
        <Link href="/transazioni" className="flex items-baseline justify-between whitespace-nowrap">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-1">
              <b
                className="font-mono text-lg font-bold leading-tight text-primary"
                style={{ textShadow: "0 0 8px #3ddc97" }}
              >
                {loading ? "—" : value}
              </b>
              <span className="font-mono text-[9px] text-gray-400">{label}</span>
            </div>
          ))}
        </Link>
      </div>

      {/* Modale giorno (condivisa con Panoramica) — fuori dalla card: lo swipe nella modale non tocca il calendario */}
      <DayTransactionsModal
        open={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        date={selectedDate ?? today}
        transactions={txByDate.get(selectedKey) ?? []}
        ricorrenze={ricorrenzeMap.get(selectedKey) ?? []}
      />
    </>
  );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Calendario compatto della Home mobile. Mostra la settimana corrente da
// lunedì (oggi evidenziato) con un pallino per giorno: arancio = spese,
// verde = entrate, rosso = spesa in arrivo (da /upcoming, passato da
// HomePage). "MESE ▾" o swipe giù espandono il calendario mensile con
// animazione grid-template-rows 0fr→1fr (200ms). Tap su un giorno apre
// DayTransactionsModal (condivisa con Panoramica): transazioni e
// ricorrenze previste calcolate con le stesse chiavi giorno locali
// (anyToLocalKey / buildRicorrenzeMap). Sotto, conteggi transazioni su
// una riga (contatore mono verde con glow + etichetta accanto), stessa
// logica di TransazioniCard; tap → /transazioni.
// ----------------------------------------------------------------------
