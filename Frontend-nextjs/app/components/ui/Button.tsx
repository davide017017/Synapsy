"use client";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
    return (
        <button
            {...props}
            className={`px-4 py-2 rounded-xl bg-primary text-bg font-semibold text-sm
                        hover:opacity-90 transition shadow active:scale-95
                        ${props.className || ""}`}
        />
    );
}
