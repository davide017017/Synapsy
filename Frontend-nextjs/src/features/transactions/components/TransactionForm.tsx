// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Form transazione con suggeritore categoria ML
// Dettagli: integra CategorySuggestionChip sotto il campo descrizione
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { useFormContext } from 'react-hook-form';
import CategorySuggestionChip from './CategorySuggestionChip';

export default function TransactionForm() {
  const { register, watch, setValue } = useFormContext();

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Descrizione</label>
        <input
          id="description"
          {...register('description')}
          className="w-full rounded border px-3 py-2"
        />
        {/* ─────────────────────────────────────────────────────────────────────────────
            Sezione: Chip suggerimento categoria (visibile se utile)
            ───────────────────────────────────────────────────────────────────────────── */}
        <CategorySuggestionChip description={watch('description') as string} />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">Categoria</label>
        <input id="category" type="number" {...register('category_id')} className="w-full rounded border px-3 py-2" />
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Salva</button>
    </form>
  );
}
