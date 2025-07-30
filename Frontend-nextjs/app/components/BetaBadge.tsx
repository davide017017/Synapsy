"use client";

interface Props {
    inline?: boolean;
    floating?: boolean;
    className?: string;
}

export default function BetaBadge({ inline = false, floating = false, className = "" }: Props) {
    if (process.env.NEXT_PUBLIC_BETA === "false") return null;
    const text =
        "Versione Beta: alcuni dati potrebbero essere cancellati; " +
        "funzionalità e UI potrebbero cambiare senza preavviso; " +
        "non usare per dati sensibili reali; per feedback scrivi a synapsy.customer@gmail.com.";
    const base =
        "inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-pink-200 text-pink-800 border border-pink-300";
    const pos = floating ? "fixed top-2 right-2 z-50" : inline ? "ml-2" : "";
    return (
        <span className={`${base} ${pos} ${className}`.trim()} title={text}>
            Beta
        </span>
    );
}
