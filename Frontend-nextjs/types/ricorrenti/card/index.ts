import type { Ricorrenza } from "@/types/types/ricorrenza";

export type CardTotaliAnnuiProps = {
    ricorrenze: Ricorrenza[];
};

export type CardGraficoPagamentiProps = {
    ricorrenze: Ricorrenza[];
    customDaysArr?: Date[];
};
