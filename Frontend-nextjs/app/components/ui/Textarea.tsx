"use client";
import { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea(props: Props) {
    return (
        <textarea
            {...props}
            rows={3}
            className={`w-full px-3 py-2 rounded-xl border border-bg-elevate bg-bg text-text text-sm
                        focus:ring-2 focus:ring-primary focus:outline-none transition
                        ${props.className || ""}`}
        />
    );
}
