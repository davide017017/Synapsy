# Frontend Routes Audit

## Route Map

| Segmento | page.tsx | layout | Link entranti | Note/Fix |
|---|---|---|---|---|
| `/` | `app/(protected)/page.tsx` | `app/(protected)/layout.tsx` | Sidebar "Home" | - |
| `/panoramica` | `app/(protected)/panoramica/page.tsx` | `app/(protected)/layout.tsx` | Sidebar, CTA HeroWelcome, card riepilogo | Agg. error.tsx/not-found.tsx a livello `(protected)` |
| `/transazioni` | `app/(protected)/transazioni/page.tsx` | `app/(protected)/transazioni/layout.tsx` | Sidebar, **TransazioniCard** | Fix link: `href="/panoramica"` → `href="/transazioni"` |
| `/profilo` | `app/(protected)/profilo/page.tsx` | `app/(protected)/layout.tsx` | Sidebar, Header avatar | Avatar unificato con util `getAvatarUrl` |

## Link Corretti/Refusi

| Componente | Prima | Dopo |
|---|---|---|
| `TransazioniCard` | `/panoramica` | `/transazioni` |

## API Endpoints Check

Eseguito `npm run check:routes` (base `http://localhost:8484`). Tutte le richieste hanno restituito `fetch failed` (server offline).

| Endpoint | GET | HEAD |
|---|---|---|
| `/api/v1/forgot-password` | errore | errore |
| `/api/v1/reset-password` | errore | errore |
| `/api/v1/me` | errore | errore |
| `/api/v1/profile` | errore | errore |
| `/api/v1/avatars` | errore | errore |
| `/api/v1/financialoverview` | errore | errore |
| `/api/v1/entrate` | errore | errore |
| `/api/v1/spese` | errore | errore |
| `/api/v1/categories` | errore | errore |
| `/api/v1/recurring-operations` | errore | errore |

## Avatar Usage

Util `src/utils/avatar.ts` ora centralizza la logica:
1. `Header` – link profilo con immagine/fallback.
2. `ProfilePage` – avatar utente principale.
3. `AvatarCard` – anteprime gallery.

## TODO / Follow-up

- Tipi mancanti per componenti `ricorrenti/*` e adapter `recurringApi.ts` (TypeScript).
- Playwright browsers non scaricabili in ambiente corrente (`403 Domain forbidden`).
- Considerare aggiornamento Next.js e gestione test e2e in CI con browser preinstallati.
