export type Ricorrenza = {
    id: number;
    nome: string;
    importo: number;
    frequenza: string; // <-- solo string!
    prossima: string;
    categoria: string;
    note: string;
};
