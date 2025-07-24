export type NewRicorrenzaModalProps = {
    open: boolean;
    onClose: () => void;
    ricorrenzaToEdit?: import("@/types/types/ricorrenza").Ricorrenza | null;
    onSave: (data: import("@/types/types/ricorrenza").RicorrenzaBase) => Promise<void>;
};

export type NewRicorrenzaFormProps = {
    onSave: (data: import("@/types/types/ricorrenza").RicorrenzaBase) => Promise<void>;
    onCancel: () => void;
    initialValues?: Partial<import("@/types/types/ricorrenza").RicorrenzaBase>;
    onChangeForm?: (data: Partial<import("@/types/types/ricorrenza").RicorrenzaBase>) => void;
};

export type NewRicorrenzaButtonProps = {
    label?: string;
    onSuccess?: (newRicorrenza: import("@/types/types/ricorrenza").Ricorrenza) => void;
};
