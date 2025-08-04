import type { Ricorrenza } from "@/types/models/ricorrenza";

export type CardTotaliAnnuiProps = {
    ricorrenze: Ricorrenza[];
};

export type CardGraficoPagamentiProps = {
    ricorrenze: Ricorrenza[];
    customDaysArr?: Date[];
};

