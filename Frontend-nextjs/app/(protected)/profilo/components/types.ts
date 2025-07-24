import { AVATAR_CHOICES } from "./constants";

export type UserType = {
    name: string;
    surname: string;
    username: string;
    email: string;
    theme: string;
    avatar: string;
};

export const DEFAULT_USER: UserType = {
    name: "Mario",
    surname: "Rossi",
    username: "mario.rossi",
    email: "mario.rossi@email.com",
    theme: "solarized",
    avatar: AVATAR_CHOICES[0],
};

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
