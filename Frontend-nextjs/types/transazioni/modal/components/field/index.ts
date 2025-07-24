export type AmountFieldProps = {
    value: number;
    onChange: (v: number) => void;
    original: number;
    showError?: boolean;
};

export type DateFieldProps = {
    value: string;
    onChange: (v: string) => void;
    original: string;
};

export type DescriptionFieldProps = {
    value: string;
    onChange: (v: string) => void;
    original: string;
    showError?: boolean;
};

export type CategoryFieldProps = {
    value: number | undefined;
    categories: import("@/types/types/category").Category[];
    onChange: (id: number, cat: import("@/types/types/category").Category | undefined) => void;
    original: number | undefined;
    showError?: boolean;
};

export type NotesFieldProps = {
    value?: string;
    onChange: (v: string) => void;
    original: string;
};
