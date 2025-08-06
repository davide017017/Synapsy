"use client";

import AvatarCard from "@/app/components/AvatarCard";
import { useAvatars } from "@/hooks/useAvatars";

// ──────────────────────────────────────────────────────────
// AvatarSelector — galleria avatar responsive (5 per riga su desktop)
// ──────────────────────────────────────────────────────────
type AvatarSelectorProps = {
    selected: string;
    onSelect: (val: string) => void;
};

export default function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
    const { avatars, loading } = useAvatars();

    if (loading) return <p className="p-4 text-center">Caricamento...</p>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {avatars.map((a) => (
                <AvatarCard
                    key={a.id}
                    src={a.src}
                    label={a.label}
                    selected={selected === a.src}
                    onClick={() => onSelect(a.src)}
                />
            ))}
        </div>
    );
}
