"use client";

interface Props {
    inline?: boolean;
}

export default function BetaBadge({ inline = false }: Props) {
    if (process.env.NEXT_PUBLIC_BETA !== "true") return null;
    const text =
        "Versione Beta - Alcuni dati potrebbero essere cancellati. " +
        "Alcune funzionalita potrebbero essere modificate o rimosse. " +
        "Feedback e bug possono essere comunicati a support@synapsy.app";
    const className = inline
        ? "ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-black"
        :
          "fixed top-2 right-2 z-50 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-black";
    return (
        <span className={className} title={text}>
            Beta
        </span>
    );
}
