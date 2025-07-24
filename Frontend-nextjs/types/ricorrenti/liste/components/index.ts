import type { Ricorrenza } from "@/types/models/ricorrenza";

export type RicorrenzaGroupProps = {
    freq: string;
    items: Ricorrenza[];
    showSeparator?: boolean;
    onEdit?: (r: Ricorrenza) => void;
    onDelete?: (r: Ricorrenza) => void;
};

export type RicorrenzaItemProps = {
    r: Ricorrenza;
    onEdit?: (r: Ricorrenza) => void;
    onDelete?: (r: Ricorrenza) => void;
};
