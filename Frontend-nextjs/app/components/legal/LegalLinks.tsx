"use client";
import { useState } from "react";
import PrivacyModal from "./PrivacyModal";
import TermsModal from "./TermsModal";
import { ShieldCheck, ScrollText } from "lucide-react";

interface Props {
    className?: string;
}

export default function LegalLinks({ className = "" }: Props) {
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    return (
        <div className={`flex justify-center gap-3 ${className}`.trim()}>
            {/* Privacy */}
            <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs transition
                  bg-[hsl(var(--c-secondary)/0.14)] text-[hsl(var(--c-secondary))]
                  border border-[hsl(var(--c-secondary-light))]
                  hover:bg-[hsl(var(--c-secondary)/0.28)] hover:border-[hsl(var(--c-secondary))]
                  hover:text-[hsl(var(--c-secondary-dark))]
                  focus:outline-none hover:shadow
                "
            >
                <ShieldCheck size={16} className="opacity-80" />
                Privacy
            </button>
            {/* Termini */}
            <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs transition
                  bg-[hsl(var(--c-primary)/0.13)] text-[hsl(var(--c-primary))]
                  border border-[hsl(var(--c-primary-light))]
                  hover:bg-[hsl(var(--c-primary)/0.22)] hover:border-[hsl(var(--c-primary))]
                  hover:text-[hsl(var(--c-primary-dark))]
                  focus:outline-none hover:shadow
                "
            >
                <ScrollText size={16} className="opacity-80" />
                Termini
            </button>

            {/* Modali */}
            <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
            <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    );
}

