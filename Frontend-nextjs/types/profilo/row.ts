export type RowProps = {
    label: string;
    value: string;
    editing?: boolean;
    onEdit: () => void;
    onChange: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
    type?: "text" | "select";
    options?: { value: string; label: string }[];
    disabled?: boolean;
};

export type ThemeSelectorRowProps = {
    value: string;
    editing: boolean | undefined;
    onEdit: () => void;
    onSave: (val: string) => void;
    onCancel: () => void;
};
