export type NewTransactionButtonProps = {
    label?: string;
};

export type NewTransactionFormProps = {
    onSave?: (data: import("@/types").TransactionBase) => void;
    transaction?: import("@/types").Transaction;
    disabled?: boolean;
    onChangeForm?: (data: Partial<import("@/types").TransactionBase>) => void;
    onCancel?: () => void;
};
