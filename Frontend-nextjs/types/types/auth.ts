export type User = {
    id: number;
    name: string;
    email: string;
};

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
};
