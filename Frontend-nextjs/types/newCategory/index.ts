export type NewCategoryModalProps = {
    open: boolean;
    onClose: () => void;
    categoryToEdit?: import("@/types").Category | null;
    onSave: (data: import("@/types").CategoryBase) => Promise<void>;
};

export type NewCategoryButtonProps = {
    label?: string;
    compact?: boolean; // versione compatta per la Home mobile (flex-1, 30px)
    onSuccess?: () => void;
};

