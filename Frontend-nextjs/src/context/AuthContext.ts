// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Hook Auth (token da NextAuth)
// Dettagli: espone token Bearer per chiamate API
// ─────────────────────────────────────────────────────────────────────────────
import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data } = useSession();
  return { token: data?.accessToken as string | undefined };
}
