export type NewTransactionButtonProps = {
    label?: string;
    compact?: boolean; // versione compatta per la Home mobile (flex-1, 30px)
};

export type NewTransactionFormProps = {
    onSave?: (data: import("@/types").TransactionBase) => void;
    transaction?: import("@/types").Transaction;
    disabled?: boolean;
    onChangeForm?: (data: Partial<import("@/types").TransactionBase>) => void;
    onCancel?: () => void;
    initialDate?: string;
    initialType?: "entrata" | "spesa";
    categoryPickerOpen?: boolean;
    onCategoryPickerOpenChange?: (open: boolean) => void;
    onDelete?: () => void;
};
