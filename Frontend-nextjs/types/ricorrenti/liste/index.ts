import type { Dispatch, SetStateAction } from "react";
import type { Ricorrenza } from "@/types/models/ricorrenza";

export type ListaProssimiPagamentiProps = {
    pagamenti: Ricorrenza[];
    filtro: "tutti" | "settimana" | "mese";
    setFiltro: Dispatch<SetStateAction<"tutti" | "settimana" | "mese">>;
    totaleSettimana: number;
    totaleMese: number;
    onEditOccorrenza?: (ric: Ricorrenza) => void;
    onDeleteOccorrenza?: (ric: Ricorrenza) => void;
};

export type SectionOccorrenzeProps = {
    title: string;
    occorrenze: { ricorrenza: Ricorrenza; data: string }[];
    bilancio: number;
    onEdit?: (ric: Ricorrenza) => void;
    onDelete?: (ric: Ricorrenza) => void;
};

export type ListaRicorrenzePerFrequenzaProps = {
    ricorrenze: Ricorrenza[];
    onEdit?: (r: Ricorrenza) => void;
    onDelete?: (r: Ricorrenza) => Promise<void> | void;
};

export * from "./components";

