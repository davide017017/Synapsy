// ─────────────────────────────────────────────────────────────────────────────
// Sezione: ML suggest API client (via backend Laravel protetto Sanctum)
// Dettagli: POST /api/v1/ml/suggest-category → { category, confidence }
// ─────────────────────────────────────────────────────────────────────────────
export type MlSuggestion = { category: string | null; confidence: number };

export async function suggestCategory(description: string, token: string): Promise<MlSuggestion> {
  // ── guard: input minimo
  if (!description || description.trim().length < 3) {
    return { category: null, confidence: 0 };
  }

  // ── endpoint base
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) return { category: null, confidence: 0 };

  // ── fetch con fallback silenzioso
  try {
    const res = await fetch(`${base}/api/v1/ml/suggest-category`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    if (!res.ok) return { category: null, confidence: 0 };
    const data = await res.json() as MlSuggestion;
    // ── normalizza struttura minima
    return {
      category: typeof data?.category === 'string' ? data.category : null,
      confidence: typeof data?.confidence === 'number' ? data.confidence : 0,
    };
  } catch {
    return { category: null, confidence: 0 };
  }
}
