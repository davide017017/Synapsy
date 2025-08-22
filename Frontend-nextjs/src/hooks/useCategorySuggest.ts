// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Hook di suggerimento ML con debounce
// Dettagli: chiama l’API dopo 300ms di pausa nella digitazione
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { suggestCategory, MlSuggestion } from '@/api/mlApi';

export function useCategorySuggest(description: string, token?: string, enabled = true) {
  const [data, setData] = useState<MlSuggestion>({ category: null, confidence: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !token) { setData({ category: null, confidence: 0 }); return; }
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      try { setData(await suggestCategory(description, token)); }
      catch { setData({ category: null, confidence: 0 }); }
    }, 300);

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [description, token, enabled]);

  return data; // { category, confidence }
}
