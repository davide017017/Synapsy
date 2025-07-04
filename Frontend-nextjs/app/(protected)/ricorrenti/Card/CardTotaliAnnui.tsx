"use client";

// ============================
// CardTotaliAnnui.tsx
// Card: riepilogo entrate/spese ricorrenti per frequenza (tabellare)
// ============================

import { Repeat, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { aggregaRicorrenzePerTipoEFrequenza, frequenzaOrder, sommaTotaleAnnua } from "../utils/ricorrenza-utils";
import { Ricorrenza } from "@/types/types/ricorrenza";

// --------- Props tipizzate ---------
type Props = {
    ricorrenze: Ricorrenza[];
};

// --------- Funzione per ordinare frequenze ---------
function ordinaFrequenza(a: string, b: string) {
    return (
        (frequenzaOrder[a as keyof typeof frequenzaOrder] ?? 99) -
        (frequenzaOrder[b as keyof typeof frequenzaOrder] ?? 99)
    );
}

// --------- Componente principale ---------
export default function CardTotaliAnnui({ ricorrenze }: Props) {
    // ====== Raggruppa dati ======
    const aggregato = aggregaRicorrenzePerTipoEFrequenza(ricorrenze);

    // Trova tutte le frequenze usate, ordinate
    const frequenze = Object.keys({ ...aggregato.spesa, ...aggregato.entrata })
        .filter((x, i, arr) => arr.indexOf(x) === i)
        .sort(ordinaFrequenza);

    // Totali generali (colonne "importo" e "annuo")
    const totaleSpese = frequenze.reduce((sum, f) => sum + (aggregato.spesa[f]?.totale ?? 0), 0);
    const totaleSpeseAnnue = sommaTotaleAnnua(aggregato.spesa);

    const totaleEntrate = frequenze.reduce((sum, f) => sum + (aggregato.entrata[f]?.totale ?? 0), 0);
    const totaleEntrateAnnue = sommaTotaleAnnua(aggregato.entrata);

    const bilancioRicorrenti = totaleEntrateAnnue - totaleSpeseAnnue;

    // ====== Render ======
    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex flex-col gap-3 shadow-md min-h-[180px]">
            {/* ---------- Titolo Card ---------- */}
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
                        <tr>
                            <td className="px-2 py-1 font-bold" colSpan={2}>
                                Totale
                            </td>
                            <td className="px-2 py-1 font-bold text-red-700 font-mono">€{totaleSpese.toFixed(2)}</td>
                            <td className="px-2 py-1 font-bold text-red-700 font-mono">
                                €{totaleSpeseAnnue.toFixed(2)}
                            </td>
                            <td className="px-2 py-1 font-bold text-green-700 font-mono">
                                €{totaleEntrate.toFixed(2)}
                            </td>
                            <td className="px-2 py-1 font-bold text-green-700 font-mono">
                                €{totaleEntrateAnnue.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-2 py-1 font-bold" colSpan={2}>
                                Bilancio Ricorrenti Annui
                            </td>
                            <td className="px-2 py-1 font-bold text-primary font-mono" colSpan={4}>
                                €{bilancioRicorrenti.toFixed(2)}
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
