// ============================
// CardTotaliAnnui.tsx — Tabella riepilogo ricorrenze annue
// ============================

import { Repeat, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { aggregaRicorrenzePerTipoEFrequenza, frequenzaOrder, sommaTotaleAnnua } from "../utils/ricorrenza-utils";
import { Ricorrenza } from "@/types/types/ricorrenza";

// --------- Props tipizzate ---------
type Props = {
    ricorrenze: Ricorrenza[];
};

// --------- Ordina frequenze ---------
function ordinaFrequenza(a: string, b: string) {
    return (
        (frequenzaOrder[a as keyof typeof frequenzaOrder] ?? 99) -
        (frequenzaOrder[b as keyof typeof frequenzaOrder] ?? 99)
    );
}

// --------- Utility colore bilancio ---------
function getBilancioColor(val: number) {
    if (val > 0) return "text-[hsl(var(--c-total-positive-text))] bg-[hsl(var(--c-total-positive-bg))]/80";
    if (val < 0) return "text-[hsl(var(--c-total-negative-text))] bg-[hsl(var(--c-total-negative-bg))]/80";
    return "text-[hsl(var(--c-total-neutral-text))] bg-[hsl(var(--c-total-neutral-bg))]/80";
}

// --------- Componente principale ---------
export default function CardTotaliAnnui({ ricorrenze }: Props) {
    // ====== Raggruppa dati ======
    const aggregato = aggregaRicorrenzePerTipoEFrequenza(ricorrenze);

    // Trova tutte le frequenze usate, ordinate
    const frequenze = Object.keys({ ...aggregato.spesa, ...aggregato.entrata })
        .filter((x, i, arr) => arr.indexOf(x) === i)
        .sort(ordinaFrequenza);

    // Totali annui
    const totaleSpeseAnnue = sommaTotaleAnnua(aggregato.spesa);
    const totaleEntrateAnnue = sommaTotaleAnnua(aggregato.entrata);
    const bilancioRicorrenti = totaleEntrateAnnue - totaleSpeseAnnue;

    // ====== Render ======
    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex flex-col gap-3 shadow-md min-h-[180px]">
            {/* ---------- Titolo ---------- */}
            <div className="flex items-center gap-2 text-2xl font-bold mb-2">
                <Repeat className="w-7 h-7 text-primary" />
                Riepilogo Ricorrenze Annue
            </div>
            {/* ---------- TABELLA ---------- */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm text-left">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 font-semibold text-zinc-400"></th>
                            <th className="px-2 py-1 font-semibold text-zinc-500">Frequenza</th>
                            <th className="px-2 py-1 font-semibold text-red-700">
                                <ArrowDownCircle className="inline w-4 h-4 mr-1" />
                                Spese
                            </th>
                            <th className="px-2 py-1 font-semibold text-red-700">Annue</th>
                            <th className="px-2 py-1 font-semibold text-green-700">
                                <ArrowUpCircle className="inline w-4 h-4 mr-1" />
                                Entrate
                            </th>
                            <th className="px-2 py-1 font-semibold text-green-700">Annue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {frequenze.map((freq) => (
                            <tr key={freq}>
                                <td className="px-2 py-1 text-zinc-400 font-mono"></td>
                                <td className="px-2 py-1">{freq}</td>
                                <td className="px-2 py-1 text-red-700 font-mono">
                                    €{(aggregato.spesa[freq]?.totale ?? 0).toFixed(2)}
                                </td>
                                <td className="px-2 py-1 text-red-700 font-mono">
                                    €{(aggregato.spesa[freq]?.totaleAnnuale ?? 0).toFixed(2)}
                                </td>
                                <td className="px-2 py-1 text-green-700 font-mono">
                                    €{(aggregato.entrata[freq]?.totale ?? 0).toFixed(2)}
                                </td>
                                <td className="px-2 py-1 text-green-700 font-mono">
                                    €{(aggregato.entrata[freq]?.totaleAnnuale ?? 0).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {/* --------- Totali: solo colonna Annue --------- */}
                        <tr>
                            <td className="px-2 py-1 font-bold" colSpan={2}>
                                Totale
                            </td>
                            <td className="px-2 py-1 font-bold text-red-700 font-mono"></td>
                            <td className="px-2 py-1 font-bold text-red-700 font-mono">
                                €{totaleSpeseAnnue.toFixed(2)}
                            </td>
                            <td className="px-2 py-1 font-bold text-green-700 font-mono"></td>
                            <td className="px-2 py-1 font-bold text-green-700 font-mono">
                                €{totaleEntrateAnnue.toFixed(2)}
                            </td>
                        </tr>
                        {/* --------- Bilancio Annui: centrale e colore utility --------- */}
                        <tr>
                            <td className="px-2 py-2 font-bold text-center" colSpan={6}>
                                <span
                                    className={`text-lg font-bold px-4 py-1 rounded-xl border shadow-sm ${getBilancioColor(
                                        bilancioRicorrenti
                                    )}`}
                                    style={{
                                        minWidth: 140,
                                        display: "inline-block",
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "hsl(var(--c-total-positive-border))",
                                    }}
                                >
                                    Bilancio Ricorrenti Annui: {bilancioRicorrenti >= 0 ? "+" : "–"}€
                                    {Math.abs(bilancioRicorrenti).toFixed(2)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

// ============================
// END CardTotaliAnnui.tsx
// ============================
