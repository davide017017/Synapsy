// ╔══════════════════════════════════════════════════════╗
// ║   YearDividerRow.tsx — Divider ANNO tabella         ║
// ╚══════════════════════════════════════════════════════╝

import type { YearDividerRowProps } from "@/types/transazioni/list";

export default function YearDividerRow({ year, colSpan, entrate = 0, spese = 0, saldo = 0, className }: YearDividerRowProps) {
    return (
        <tr className={className}>
            <td
                colSpan={colSpan}
                className="
                    bg-[hsl(var(--c-table-divider-year-bg))]
                    text-[hsl(var(--c-table-header-text))]
                    border-t border-[hsl(var(--c-table-divider))]
                    py-2 px-3 font-semibold
                "
            >
                <div className="flex justify-between items-center flex-wrap gap-1">
                    <span className="text-lg">📅 {year}</span>
                    <span className="flex gap-5 items-center">
                        {/* Entrate */}
                        <span className="text-[hsl(var(--c-table-success-2))]">
                            Entrate:{" "}
                            <span className="font-bold">
                                {entrate?.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
                            </span>
                        </span>
                        {/* Spese */}
                        <span className="text-[hsl(var(--c-table-danger-2))]">
                            Spese:{" "}
                            <span className="font-bold">
                                {spese?.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
                            </span>
                        </span>
                        {/* Saldo */}
                        <span
                            className={
                                saldo >= 0
                                    ? "text-[hsl(var(--c-table-success-2))]"
                                    : "text-[hsl(var(--c-table-danger-2))]"
                            }
                        >
                            <b>
                                Saldo: {saldo >= 0 ? "+" : ""}
                                {saldo?.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
                            </b>
                        </span>
                    </span>
                </div>
            </td>
        </tr>
    );
}
