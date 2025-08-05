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
        fetch("/api/v1/avatars")
            .then((res) => res.json())
            .then((data) => {
                setAvatars(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Errore caricamento avatar:", err);
                setLoading(false);
            });
    }, []);

    return { avatars, loading };
}
