"use client";
import { useState } from "react";
import PrivacyModal from "./PrivacyModal";
import TermsModal from "./TermsModal";

interface Props {
  className?: string;
}

export default function LegalLinks({ className = "" }: Props) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  return (
    <div className={`space-x-2 text-xs ${className}`.trim()}>
      <button className="underline hover:text-white" onClick={() => setShowPrivacy(true)}>
        Privacy
      </button>
      <button className="underline hover:text-white" onClick={() => setShowTerms(true)}>
        Termini
      </button>
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
