"use client";

import { useEffect, useState } from "react";

export type AvatarOption = {
    id: number;
    label: string;
    src: string;
};

export function useAvatars() {
    const [avatars, setAvatars] = useState<AvatarOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL non definita");
            setLoading(false);
            return;
        }

        fetch(`${apiUrl}/v1/avatars`)
            .then((res) => {
                if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
                return res.json();
            })
            .then((data) => setAvatars(data))
            .catch((err) => console.error("Errore caricamento avatar:", err))
            .finally(() => setLoading(false));
    }, []);

    return { avatars, loading };
}
