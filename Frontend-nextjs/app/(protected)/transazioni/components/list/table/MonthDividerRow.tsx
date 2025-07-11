// ============================
// Divider MESE tabella transazioni
// ============================
import { labelMeseAnno } from "./utils";

type Props = {
    monthKey: string;
    colSpan: number;
    entrate?: number;
    spese?: number;
    saldo?: number;
    className?: string;
};

export default function MonthDividerRow({ monthKey, colSpan, entrate = 0, spese = 0, saldo = 0, className }: Props) {
    return (
        <tr className={className}>
            <td colSpan={colSpan} className="table-divider table-divider-month">
                <div className="flex justify-between items-center flex-wrap gap-1">
                    <span>{labelMeseAnno(monthKey)}</span>
                    <span className="flex gap-3 items-center">
                        {/* Entrate */}
                        <span className="text-table-success">
                            Entrate:{" "}
                            <span className="font-bold">
                                {entrate.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
                            </span>
                        </span>
                        {/* Spese */}
                        <span className="text-table-danger">
                            Spese:{" "}
                            <span className="font-bold">
                                {spese.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
                            </span>
                        </span>
                        {/* Saldo */}
                        <span className={saldo >= 0 ? "text-table-success-2" : "text-table-danger-2"}>
                            <b>
                                Saldo: {saldo >= 0 ? "+" : ""}
                                {saldo.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
                            </b>
                        </span>
                    </span>
                </div>
            </td>
        </tr>
    );
}
