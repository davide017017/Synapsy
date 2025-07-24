export type RowProps = {
    label: string;
    value: string;
    editing?: boolean;
    onEdit: () => void;
    onChange: (v: string) => void;
    onSave: () => void;
    type?: "text" | "select";
    options?: { value: string; label: string }[];
};
