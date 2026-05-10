"use client";

// ─── Imports ──────────────────────────────────────────────────────────────────
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AmountStepButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  position: "top" | "bottom";
  accent?: string;
  soft?: string;
  border?: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_ACCENT = "hsl(var(--c-primary))";
const DEFAULT_SOFT   = "hsl(var(--c-primary) / 0.12)";
const DEFAULT_BORDER = "hsl(var(--c-primary) / 0.35)";

// ─── Component ────────────────────────────────────────────────────────────────
export function AmountStepButton({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  position,
  accent = DEFAULT_ACCENT,
  soft   = DEFAULT_SOFT,
  border = DEFAULT_BORDER,
}: AmountStepButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Forma arrotondata sopra o sotto in base alla posizione
  const roundedClass =
    position === "top"
      ? "rounded-t-full rounded-b-none"
      : "rounded-b-full rounded-t-none";

  // Stili dinamici: hover e active applicati via inline style
  // perché i colori arrivano come stringhe CSS arbitrarie (es. "hsl(25 95% 53%)")
  // e non possono essere usati in classi Tailwind arbitrarie in modo affidabile.
  const dynamicStyle: React.CSSProperties = {};
  if (hovered && !disabled) {
    dynamicStyle.borderColor = border;
    dynamicStyle.boxShadow   = `0 0 10px ${border}`;
  }
  if (pressed && !disabled) {
    dynamicStyle.backgroundColor = soft;
    dynamicStyle.boxShadow       = `inset 0 0 10px ${border}`;
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={[
        "h-10 w-7 sm:h-11 sm:w-10",
        roundedClass,
        "border bg-black/25 font-mono font-semibold",
        "flex items-center justify-center",
        "transition-all duration-150",
        "active:scale-95",
        "disabled:opacity-40 disabled:cursor-not-allowed",
      ].join(" ")}
      style={dynamicStyle}
    >
      <span className="text-xl font-bold leading-none select-none">
        {children}
      </span>
    </button>
  );
}

/*
 * AmountStepButton.tsx
 *
 * Serve a: fornire un bottone riutilizzabile per gli stepper verticali
 * dell'importo (es. +10 / −10) in NewTransactionForm e NewRicorrenzaForm.
 *
 * Cosa fa: renderizza un <button> con forma arrotondata sul lato superiore
 * o inferiore (prop `position`), feedback visivo hover/active tramite glow
 * e background dinamici, e supporto per colori tematici passati dall'esterno.
 *
 * Come lo fa: hover e active usano stato React locale (hovered, pressed) e
 * inline style — necessario perché i colori arrivano come stringhe CSS
 * arbitrarie non esprimibili in classi Tailwind arbitrarie in modo sicuro.
 * I fallback puntano alla CSS var --c-primary del tema corrente.
 */
