export type DeleteCategoryModalProps = {
    category: import("@/types").Category | null;
    onClose: () => void;
    categories: import("@/types").Category[];
    onDelete: (mode: "deleteAll" | "move", targetCategoryId?: number) => void | Promise<void>;
};
