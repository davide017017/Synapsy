// ─────────────────────────────────────────────────────────────────────────────
// Sezione: UI - Chip suggerimento categoria
// Dettagli: mostra suggerimento e imposta category_id nel form (RHF) al click
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useCategories } from '@/context/CategoriesContext';
import { useCategorySuggest } from '@/hooks/useCategorySuggest';

type Props = {
  description: string;
  threshold?: number; // default 0.6
};

// ── sinonimi per mapping robusto
const HINT_MAP: Record<string, string[]> = {
  cibo: ['cibo', 'alimentari', 'ristorante', 'food', 'pizza', 'pasta'],
  finanza: ['finanza', 'tasse', 'bollette', 'banca', 'fattura', 'invoice', 'tax'],
  casa: ['casa', 'affitto', 'utenze', 'home', 'rent'],
};

// ── util: trova id categoria coerente col suggerimento
function findCategoryId(hint: string | null, categories: { id:number; name:string }[]) {
  if (!hint) return null;
  const keys = HINT_MAP[hint] ?? [hint];
  const norm = (s:string) => s.toLowerCase();
  const hit = categories.find(cat => keys.some(k => norm(cat.name).includes(norm(k))));
  return hit?.id ?? null;
}

export default function CategorySuggestionChip({ description, threshold = 0.6 }: Props) {
  const featureOn = process.env.NEXT_PUBLIC_FEATURE_SUGGEST_CATEGORY === 'true';
  const { token } = useAuth();
  const { categories } = useCategories();
  const { setValue } = useFormContext();
  const { category, confidence } = useCategorySuggest(description, token, featureOn);

  const show = useMemo(() => {
    return Boolean(category) && typeof confidence === 'number' && confidence >= threshold;
  }, [category, confidence, threshold]);

  if (!show) return null;

  const onApply = () => {
    const id = findCategoryId(category, categories);
    if (id) setValue('category_id', id, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <button
      type="button"
      onClick={onApply}
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:shadow"
      title="Applica categoria suggerita"
    >
      <span>💡 Suggerito: <b>{category}</b></span>
      <span>({Math.round(confidence * 100)}%)</span>
      <span className="underline">Applica</span>
    </button>
  );
}
