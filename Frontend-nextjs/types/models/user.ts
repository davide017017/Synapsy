import type { Theme } from "@/context/contexts/ThemeContext";

export type UserType = {
    name: string;
    surname: string;
    username: string;
    email: string;
    theme: Theme;
    avatar: string;
    pending_email?: string | null;
};

export const DEFAULT_USER: UserType = {
    name: "Nome ...",
    surname: "Cognome...",
    username: "Username...",
    email: "Email...",
    theme: "dark",
    avatar: "/images/avatars/avatar_01_boy.webp",
    pending_email: null,
};

