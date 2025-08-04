export type TransactionDetailModalProps = {
    transaction: import("@/types/models/transaction").Transaction;
    onClose: () => void;
    categories: import("@/types/models/category").Category[];
    onEdit?: (t: import("@/types/models/transaction").Transaction) => void;
    onDelete?: (t: import("@/types/models/transaction").Transaction) => void;
};

export type TransactionDetailFormProps = {
    formData: import("@/types/models/transaction").Transaction;
    setFormData: (fd: import("@/types/models/transaction").Transaction) => void;
    categories: import("@/types/models/category").Category[];
    selectedType: "entrata" | "spesa";
    showErrors: boolean;
    transaction: import("@/types/models/transaction").Transaction;
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

