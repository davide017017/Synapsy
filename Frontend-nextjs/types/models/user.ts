import { AVATAR_CHOICES } from "@/app/(protected)/profilo/components/constants";

export type UserType = {
    name: string;
    surname: string;
    username: string;
    email: string;
    theme: string;
    avatar: string;
    pending_email?: string | null;
};

export const DEFAULT_USER: UserType = {
    name: "Mario",
    surname: "Rossi",
    username: "mario.rossi",
    email: "mario.rossi@email.com",
    theme: "dark",
    avatar: AVATAR_CHOICES[0],
    pending_email: null,
};
