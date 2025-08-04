"use client";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
    return (
        <input
            {...props}
            className={`block mx-auto w-full px-3 py-2 rounded-xl border border-bg-elevate bg-bg text-text text-sm
                        focus:ring-2 focus:ring-primary focus:outline-none transition
                        ${props.className || ""}`}
        />
    );
}

