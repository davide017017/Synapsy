import type { Ricorrenza } from "@/types/models/ricorrenza";

export type FiltroRicorrenti = "tutti" | "settimana" | "mese" | "frequenza";

export type Occorrenza = { ricorrenza: Ricorrenza; data: string };

export type ListaProssimiPagamentiProps = {
    filtro: Exclude<FiltroRicorrenti, "frequenza">;
    occorrenze7: Occorrenza[];
    occorrenze30: Occorrenza[];
    bilancio7: number;
    bilancio30: number;
    onEdit: (ric: Ricorrenza) => void;
    onDelete: (ric: Ricorrenza) => void;
};

export type SectionOccorrenzeProps = {
    title: string;
    occorrenze: Occorrenza[];
    bilancio: number;
    onEdit: (ric: Ricorrenza) => void;
    onDelete: (ric: Ricorrenza) => void;
};

export type ListaRicorrenzePerFrequenzaProps = {
    ricorrenze: Ricorrenza[];
    onEdit: (r: Ricorrenza) => void;
    onDelete: (r: Ricorrenza) => void;
};

export type RigaRicorrenzaProps = {
    r: Ricorrenza;
    data: string;
    showYear?: boolean;
    onEdit: (r: Ricorrenza) => void;
    onDelete: (r: Ricorrenza) => void;
};
