// ╔═════════════════════════════════════════════════════════╗
// ║        Tipi Ricorrenza - Backend & Frontend            ║
// ╚═════════════════════════════════════════════════════════╝

// ============================
// Ricorrenza "completa" (risposta backend)
// ============================
export type Ricorrenza = {
    category_color: any;
    id: number;
    nome: string;
    importo: number;
    frequenza: string;
    prossima: string;
    category_id: number;
    categoria: string; // ← nome categoria (dal join), solo risposta

    notes: string;
    type: "entrata" | "spesa";
    is_active: boolean; // stato della regola (true=attiva)
    interval: number; // <--- idem, opzionale
};

// ============================
// RicorrenzaBase: dati minimi per creazione/aggiornamento
// ============================
export type RicorrenzaBase = {
    nome: string; // Descrizione/nome della ricorrenza
    importo: number; // Importo della ricorrenza
    frequenza: string; // Frequenza in IT (es: Mensile)
    prossima: string; // Data prossima scadenza (YYYY-MM-DD)
    category_id: number; // Categoria collegata
    notes: string; // Note opzionali
    type: "entrata" | "spesa"; // Tipo
    is_active: boolean; // true=attiva, false=disattivata (obbligatorio)
    interval: number; // Quanti intervalli tra una ricorrenza e l'altra (es: 1=ogni mese)
};

