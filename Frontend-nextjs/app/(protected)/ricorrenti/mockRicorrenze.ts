// /app/(protected)/ricorrenti/mockRicorrenze.ts

import { Ricorrenza } from "../../../types/types/ricorrenza";

export const mockRicorrenze: Ricorrenza[] = [
    {
        id: 1,
        nome: "Netflix",
        importo: 11.99,
        frequenza: "Mensile",
        prossima: "2025-07-01",
        categoria: "Abbonamento",
        note: "Famiglia",
    },
    {
        id: 2,
        nome: "Enel Energia",
        importo: 52.7,
        frequenza: "Bimestrale",
        prossima: "2025-07-12",
        categoria: "Bollette",
        note: "Luce casa",
    },
    {
        id: 3,
        nome: "Amazon Prime",
        importo: 49.9,
        frequenza: "Annuale",
        prossima: "2026-02-23",
        categoria: "Abbonamento",
        note: "",
    },
    // ========== Ricorrenza 4 ==========
    {
        id: 4,
        nome: "Sky TV",
        importo: 34.9,
        frequenza: "Mensile",
        prossima: "2025-07-05",
        categoria: "Abbonamento",
        note: "Sport + Cinema",
    },
    // ========== Ricorrenza 5 ==========
    {
        id: 5,
        nome: "Spotify Family",
        importo: 15.99,
        frequenza: "Mensile",
        prossima: "2025-07-08",
        categoria: "Abbonamento",
        note: "Musica per tutta la famiglia",
    },
];
