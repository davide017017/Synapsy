"use client";

import Image from "next/image";
import clsx from "clsx";
import getAvatarUrl from "@/utils/getAvatarUrl";

export type AvatarCardProps = {
    src: string;
    label?: string;
    selected?: boolean;
    onClick?: () => void;
};

export default function AvatarCard({ src, label, selected, onClick }: AvatarCardProps) {
    const url = getAvatarUrl(src);

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={onClick}
                className={clsx(
                    "overflow-hidden rounded-full border transition-shadow",
                    selected ? "ring-2 ring-primary" : "ring-1 ring-transparent"
                )}
            >
                <Image src={url} alt={label ?? "Avatar"} width={64} height={64} className="w-16 h-16 object-cover" />
            </button>
            {label && <span className="text-sm text-center">{label}</span>}
        </div>
    );
}
