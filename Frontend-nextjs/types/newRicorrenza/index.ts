export type NewRicorrenzaModalProps = {
    open: boolean;
    onClose: () => void;
    ricorrenzaToEdit?: import("@/types/models/ricorrenza").Ricorrenza | null;
    onSave: (data: import("@/types/models/ricorrenza").RicorrenzaBase) => Promise<void>;
};

export type NewRicorrenzaFormProps = {
    onSave: (data: import("@/types/models/ricorrenza").RicorrenzaBase) => Promise<void>;
    onCancel: () => void;
    initialValues?: Partial<import("@/types/models/ricorrenza").RicorrenzaBase>;
    onChangeForm?: (data: Partial<import("@/types/models/ricorrenza").RicorrenzaBase>) => void;
};

export type NewRicorrenzaButtonProps = {
    label?: string;
    onSuccess?: (newRicorrenza: import("@/types/models/ricorrenza").Ricorrenza) => void;
};
