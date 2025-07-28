"use client";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
    const { className = "", style, disabled, ...rest } = props;
    return (
        <button
            {...rest}
            disabled={disabled}
            className={`px-4 py-2 rounded-2xl font-semibold flex justify-center items-center gap-2 text-white shadow-md transition-all duration-200 bg-gradient-to-r from-primary to-primary-dark hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                disabled ? "opacity-70 cursor-not-allowed" : ""
            } ${className}`}
            style={{ background: "var(--c-primary-gradient)", ...style }}
        />
    );
}
