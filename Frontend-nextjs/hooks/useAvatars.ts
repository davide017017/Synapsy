"use client";

import { useEffect, useState } from "react";
import { url } from "@/lib/api/endpoints";

export type AvatarOption = {
    id: number;
    label: string;
    src: string;
};

export function useAvatars() {
    const [avatars, setAvatars] = useState<AvatarOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(url("avatars"))
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
