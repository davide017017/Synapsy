export type TransactionDetailModalProps = {
    transaction: import("@/types/types/transaction").Transaction;
    onClose: () => void;
    categories: import("@/types/types/category").Category[];
    onEdit?: (t: import("@/types/types/transaction").Transaction) => void;
    onDelete?: (t: import("@/types/types/transaction").Transaction) => void;
};

export type TransactionDetailFormProps = {
    formData: import("@/types/types/transaction").Transaction;
    setFormData: (fd: import("@/types/types/transaction").Transaction) => void;
    categories: import("@/types/types/category").Category[];
    selectedType: "entrata" | "spesa";
    showErrors: boolean;
    transaction: import("@/types/types/transaction").Transaction;
};

export type TransactionTypeSwitchProps = {
    selectedType: "entrata" | "spesa";
    setSelectedType: (t: "entrata" | "spesa") => void;
    disabled?: boolean;
};

export type TransactionActionButtonsProps = {
    onSave: () => void;
    onClose: () => void;
    onDelete?: () => void;
    loading: "save" | "delete" | null;
    isSaveDisabled: boolean;
    saveTooltipMessage: string;
};

export * from "./components";
