export type CardCategoriesProps = {
    categories: import("@/types").Category[];
    onEdit: (cat: import("@/types").Category) => void;
    onDelete: (cat: import("@/types").Category) => void;
};

export type CategoryCardProps = {
    cat: import("@/types").Category;
    onEdit: (cat: import("@/types").Category) => void;
    onDelete: (cat: import("@/types").Category) => void;
};

