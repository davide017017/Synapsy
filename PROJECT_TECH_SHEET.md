# SYNAPSY FINANCE — Scheda Tecnica del Progetto

> Generata il: 09 marzo 2026
> Analisi: automatica via Claude Code
> Versione progetto: in sviluppo attivo (branch `main`, clean)

---

## 1. PANORAMICA DEL PROGETTO

**Nome**: Synapsy Finance (Synapsi)
**Tipologia**: Applicazione web + mobile per la gestione delle finanze personali
**Architettura**: Monorepo con 3 piattaforme distinte (Backend, Frontend Web, Mobile)

### Scopo e descrizione funzionale
Synapsy Finance è una piattaforma multi-piattaforma per il tracciamento delle entrate e delle uscite personali. Permette agli utenti di:
- Registrare transazioni (entrate e spese) con categoria, data, note
- Gestire operazioni ricorrenti (abbonamenti, stipendi, rate)
- Visualizzare una panoramica finanziaria mensile/annuale
- Gestire categorie personalizzate con icone e colori
- Operare da browser (Next.js) e da app mobile (Expo)

### Stato attuale
- **Backend**: produzione-ready, API complete e documentate
- **Frontend Web**: in sviluppo attivo, feature set quasi completo
- **Mobile**: MVP/prototipo (liste e CRUD in parte placeholder)

---

## 2. STACK TECNOLOGICO

### Backend — Laravel 12 (PHP 8.2+)

| Libreria | Versione | Uso |
|---|---|---|
| `laravel/framework` | ^12.0 | Core framework |
| `laravel-modules` (nwidart) | ^12.0 | Architettura modulare |
| `laravel/sanctum` | ^4.1 | Autenticazione token |
| `php-open-source-saver/jwt-auth` | ^2.8 | JWT generation |
| `resend/resend-php` | ^1.1 | Email transazionali |
| `phpunit/phpunit` | ^11.5 | Test suite |
| `larastan/larastan` | ^3.4 | Static analysis |

**Build**: Vite 6.2.4 per asset pipeline
**Database**: MySQL (dev) / PostgreSQL (prod — Render.com)

### Frontend Web — Next.js 15

| Libreria | Versione | Uso |
|---|---|---|
| `next` | 15.5.9 | Framework React SSR/SSG |
| `react` | 18.2.0 | UI library |
| `typescript` | 5.5.4 | Type safety |
| `next-auth` | ^4.24.11 | Auth (Credentials provider) |
| `tailwindcss` | 3.4.17 | Styling |
| `framer-motion` | 12.16.0 | Animazioni |
| `react-hook-form` | 7.62.0 | Gestione form |
| `zod` | 3.23.8 | Validazione schema |
| `chart.js` | 4.5.0 | Grafici finanziari |
| `playwright` | ^1.55.0 | Test E2E |

**Bundler**: Turbopack (sperimentale, abilitato)
**Linting**: ESLint (config Next.js)
**Deploy target**: Vercel

### Mobile — Expo + React Native

| Libreria | Versione | Uso |
|---|---|---|
| `expo` | ^54 | Framework mobile |
| `react` | 19.1.0 | UI (nota: React 19!) |
| `react-native` | 0.81.4 | Runtime mobile |
| `@react-navigation/native-stack` | 6.x | Navigazione |
| `zustand` | ^4.5.7 | State management |
| `expo-secure-store` | ~15.0.7 | Token storage sicuro |
| `react-hook-form` | ^7.62.0 | Form |
| `zod` | 3.22.4 | Validazione |

**Deploy**: Expo EAS

---

## 3. ARCHITETTURA

### Struttura delle cartelle

```
Synapsi/
├── Backend/                        # Laravel 12 API REST
│   ├── Modules/                    # Architettura modulare (nwidart)
│   │   ├── AuditTrail/             # Log delle modifiche
│   │   ├── Categories/             # Gestione categorie
│   │   ├── DBCore/                 # Utility database condivise
│   │   ├── Entrate/                # Transazioni in entrata
│   │   ├── FinancialOverview/      # Statistiche dashboard
│   │   ├── RecurringOperations/    # Operazioni ricorrenti
│   │   ├── Spese/                  # Transazioni in uscita
│   │   └── User/                   # Auth + profilo utente
│   ├── app/
│   │   ├── Helpers/ApiResponse.php # Wrapper risposta API unificato
│   │   └── Http/Middleware/        # PreventDemoUserModification
│   ├── database/migrations/        # Schema DB
│   ├── routes/api.php              # Entry point routing
│   └── tests/                      # PHPUnit feature tests
│
├── Frontend-nextjs/                # Next.js 15 SPA
│   ├── app/
│   │   ├── (auth)/                 # Login, reset password (route group)
│   │   ├── (protected)/            # Rotte autenticate (route group)
│   │   │   ├── home/               # Dashboard
│   │   │   ├── transazioni/        # Lista transazioni
│   │   │   ├── ricorrenti/         # Operazioni ricorrenti
│   │   │   ├── categorie/          # Gestione categorie
│   │   │   ├── panoramica/         # Calendar view
│   │   │   └── profilo/            # Profilo utente
│   │   └── api/auth/[...nextauth]/ # NextAuth.js handler
│   ├── context/                    # React Context providers
│   ├── hooks/                      # Custom React hooks
│   ├── lib/
│   │   ├── api/                    # Client HTTP + endpoint constants
│   │   └── auth/                   # NextAuth options + helpers
│   └── styles/                     # CSS globale + temi
│
└── Mobile/                         # Expo + React Native
    └── src/
        ├── screens/                # Schermate app
        ├── navigation/             # Stack + Tab navigator
        ├── context/                # AuthContext
        ├── lib/api/                # HTTP client
        └── components/             # UI components
```

### Pattern architetturali

- **Backend**: Modular Monolith. Ogni dominio funzionale (Entrate, Spese, Categories...) è un modulo indipendente con proprio Controller, Model, Routes, Migrations e Tests. Comunicazione interna via Service classes.
- **Frontend**: Context-driven architecture. Ogni dominio ha un Provider che gestisce fetch, cache e stato. Le pagine consumano lo stato via custom hooks (`useUser()`, `useTransactions()`, ecc.)
- **Mobile**: MVP con Zustand per lo stato globale, stack navigator per la navigazione.

### Flusso dei dati principale

```
[Utente] → [Next.js Page]
    → useTransactions() hook
    → TransactionsContext (cache module-level)
    → fetch con Authorization: Bearer {token}
    → [Laravel API] (Sanctum auth middleware)
    → Module Controller → Service → Model (Eloquent)
    → JSON response {data: [...]}
    → Context aggiorna stato → UI re-render
```

### Cache e deduplicazione

```typescript
// context/UserContext.tsx — pattern usato in tutti i context
const userCache: { data: User | null; token: string | null } = {
  data: null,
  token: null,
};
let fetchPromise: Promise<User> | null = null;

// Promise coalescing: se arrivano 2 richieste contemporanee, esegue 1 sola fetch
```

---

## 4. FUNZIONALITÀ PRINCIPALI

### Feature implementate

| Feature | Backend | Frontend | Mobile |
|---|---|---|---|
| Registrazione + Login | Completo | Completo | Completo |
| Verifica email | Completo | Completo | - |
| Reset password | Completo | Completo | - |
| Cambio email (pending) | Completo | Completo | - |
| Avatar utente (15 preset) | Completo | Completo | - |
| Eliminazione account (soft) | Completo | Completo | - |
| Transazioni CRUD | Completo | Completo | Placeholder |
| Filtri per data | Completo | Completo | - |
| Bulk recategorizzazione | Completo | Completo | - |
| Operazioni ricorrenti CRUD | Completo | Completo | Placeholder |
| Categorie personalizzate | Completo | Completo | - |
| Dashboard finanziaria | Completo | Completo | - |
| Temi Dark/Light/Custom | - | Completo | - |
| PWA (manifest + icons) | - | Completo | - |
| Audit Trail | Completo | - | - |
| Demo user protection | Completo | Completo | - |

### Endpoint API principali (`/api/v1`)

#### Autenticazione (pubblici, rate-limited 5/min)
```
POST   /login
POST   /register
GET    /verify-email/{id}/{hash}
POST   /forgot-password
POST   /reset-password
GET    /verify-new-email/{id}/{hash}
GET    /avatars
```

#### Utente (auth:sanctum)
```
POST   /logout
GET    /me
GET    /profile
PUT    /profile                        [bloccato per demo user]
DELETE /profile/pending-email
POST   /profile/pending-email/resend
DELETE /profile                        [bloccato per demo user]
GET    /dashboard
```

#### Transazioni (auth:sanctum)
```
GET|POST        /entrate
GET|PUT|DELETE  /entrate/{id}
PATCH           /entrate/move-category    [bulk recategorize]

GET|POST        /spese
GET|PUT|DELETE  /spese/{id}
PATCH           /spese/move-category

GET|POST        /categories
GET|PUT|DELETE  /categories/{id}

GET|POST        /recurring-operations
GET|PUT|DELETE  /recurring-operations/{id}
GET             /recurring-operations/next-occurrences
PATCH           /recurring-operations/move-category

GET             /financialoverview
```

---

## 5. CONFIGURAZIONE E AMBIENTE

### Variabili d'ambiente Backend (`.env`)

```bash
# Core
APP_NAME=Synapsy
APP_ENV=local|production
APP_DEBUG=true|false
APP_URL=http://localhost:8484

# Database
DB_CONNECTION=mysql         # pgsql in prod
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=synapsy
DB_USERNAME=root
DB_PASSWORD=

# Auth
JWT_SECRET=                 # php artisan jwt:secret
SANCTUM_STATEFUL_DOMAINS=localhost:3000

# Mail
MAIL_MAILER=smtp
MAIL_FROM_ADDRESS=noreply@synapsy.app

# Frontend link (per email di verifica)
FRONTEND_URL=http://localhost:3000
```

### Variabili d'ambiente Frontend (`.env.local`)

```bash
NEXTAUTH_SECRET=              # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8484
NEXT_PUBLIC_CDN_URL=http://localhost:3000/images/avatars
NEXT_PUBLIC_BETA=true
```

### Avvio in locale

```bash
# 1. Backend
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8484

# 2. Frontend
cd Frontend-nextjs
npm install
cp .env.example .env.local
# Editare NEXTAUTH_SECRET e NEXT_PUBLIC_API_BASE_URL
npm run dev   # http://localhost:3000

# 3. Mobile (opzionale)
cd Mobile
npm install
npx expo start
```

### File di configurazione presenti

| File | Dove | Scopo |
|---|---|---|
| `next.config.js` | Frontend | Turbopack, strict mode, image optimization |
| `tsconfig.json` | Frontend | TypeScript paths e target |
| `tailwind.config.ts` | Frontend | Temi e estensioni |
| `playwright.config.ts` | Frontend | E2E test config |
| `app.config.ts` | Mobile | Expo config (bundle ID, versione) |
| `composer.json` | Backend | Dipendenze PHP |
| `phpunit.xml` | Backend | PHPUnit config |
| `modules_statuses.json` | Backend | Moduli abilitati/disabilitati |

---

## 6. QUALITÀ DEL CODICE

### Test

**Backend (PHPUnit)**:
- `tests/Feature/ApiRoutesTest.php` — disponibilità delle route
- `tests/Feature/DemoUserProtectionTest.php` — protezione demo user
- `tests/Feature/Auth/` — Registration, Authentication, PasswordReset, EmailVerification
- `tests/Feature/ProfileTest.php` — operazioni profilo

```bash
cd Backend && composer test
```

**Frontend (Playwright E2E)**:
- `tests/avatar.spec.ts` — selezione avatar
- `tests/crud.spec.ts` — operazioni CRUD completo
- `tests/navigation.spec.ts` — navigazione tra rotte

```bash
cd Frontend-nextjs && npm run e2e
```

**Copertura stimata**:
- Backend: ~60-70% (feature tests su flow principali)
- Frontend: 0% unit test (solo E2E), `npm test` esegue: `echo "No unit tests yet"`
- Mobile: 0% (nessun test presente)

### Documentazione interna

Ottima: il progetto ha una cartella `docs/` sia in Backend che in Frontend con 10+ documenti Markdown ciascuna (AUTH_FLOW, ARCHITECTURE, DATA_MODELS, SECURITY, TESTING, WORKFLOWS...).

Il codice ha commenti dove necessario, ma non JSDoc sistematico.

### Tech debt evidente

1. **Nessun unit test nel Frontend** — solo E2E, manca coverage su logica di business
2. **Nessuna paginazione** nelle API di lista (Entrate, Spese, Categories, RecurringOps)
3. **Token in localStorage** usato in parallelo con JWT session di NextAuth (rischio inconsistenza)
4. **Feature ML suggerimento categoria** presente in env/docs ma non implementata
5. **Mobile è un MVP** — list e CRUD sono placeholder espliciti

---

## 7. SICUREZZA

### Punti di forza

- **Sanctum token** stateless per ogni chiamata API
- **Email verification** obbligatoria (nuovo account bloccato fino a verifica)
- **Rate limiting** su login/register (5 richieste/minuto)
- **Password reset** con token a scadenza (60 minuti)
- **Demo user protection** middleware applicato a tutte le rotte di scrittura
- **Soft delete** sugli account (no cancellazione permanente immediata)
- **Secure Store** di Expo per token mobile (non AsyncStorage)
- **HttpOnly cookie** per sessione NextAuth (no localStorage diretto per il token di sessione)

### Vulnerabilità potenziali

#### MEDIA — Demo user con string-match sull'email
```php
// app/Http/Middleware/PreventDemoUserModification.php
if ($user->email === 'demo@synapsy.app') {
    // blocco
}
```
**Rischio**: Se l'email cambia o si aggiunge un secondo demo user, la protezione viene bypassata.
**Fix**: Aggiungere colonna `is_demo boolean default false` sulla tabella `users`.

#### MEDIA — Token accessToken in session (lato client leggibile)
```typescript
// lib/auth/authOptions.ts — session callback
session.accessToken = token.accessToken;
```
Il token API è nel payload JWT di NextAuth, decodificabile dal client (non crittografato, solo signed).
**Fix**: Usare server-side proxy per le chiamate API (route handler Next.js), senza esporre il token al client.

#### BASSA — Nessun refresh token
Il JWT di NextAuth scade in 15 minuti; non c'è refresh token rotation. La sessione Next.js dura 30 giorni ma il token backend può scadere prima.
**Fix**: Implementare endpoint `POST /refresh-token` + logica di refresh in NextAuth `jwt` callback.

#### BASSA — Source maps disabilitati in prod (bene) ma nessun CSP header
Non risulta Content Security Policy configurata nel Next.js config.
**Fix**: Aggiungere headers CSP in `next.config.js`.

### Gestione credenziali

- `.env` correttamente escluso da git (`.gitignore`)
- `.env.example` presente e dettagliato in entrambi Backend e Frontend
- `JWT_SECRET` generato via Artisan (non hardcoded)
- `NEXTAUTH_SECRET` da generare con `openssl rand -base64 32`

---

## 8. PERFORMANCE

### Colli di bottiglia potenziali

#### ALTO — Nessuna paginazione nelle API
```php
// Modules/Entrate/Http/Controllers/EntrataController.php
return Entrata::ofUser($user)->get(); // restituisce TUTTO
```
Un utente con 10.000 transazioni riceverà tutto in un payload JSON.
**Fix urgente**: Aggiungere paginazione con `?page=1&per_page=50`.

#### MEDIO — N+1 potenziale su Category relationships
Le transazioni hanno `category_id`. Se il frontend richiede separatamente categoria per ogni transazione, c'è rischio N+1.
**Fix**: Assicurarsi che i controller usino `with('category')` (eager loading).

#### MEDIO — Context re-render non ottimizzati
```typescript
// context/TransactionsContext.tsx
const value = { transactions, entrate, spese, isLoading, error, refresh };
// Oggetto ricreato ad ogni render → tutti i consumer si ri-renderizzano
```
**Fix**: Wrappare `value` con `useMemo()`.

#### BASSO — Turbopack sperimentale in produzione
`next.config.js` ha Turbopack abilitato. Potrebbe causare comportamenti inattesi.

### Ottimizzazioni già presenti

- **Module-level cache** + promise coalescing nelle Context (evita fetch duplicate)
- **`optimizePackageImports: ["lucide-react"]`** in next.config (tree shaking icone)
- **PWA** con manifest e apple icons (caching offline parziale)
- **Skeleton loading** su tutti i componenti principali (UX mentre carica)
- **Lazy loading** implicito nei route groups di Next.js 15

---

## 9. CONSIGLI E RACCOMANDAZIONI

### Le 5 cose più urgenti (ordinate per priorità)

#### 1. PAGINAZIONE API (Priorità: CRITICA)
Senza paginazione, il progetto non scala. Con 1.000+ transazioni per utente, le performance degradano linearmente.

```php
// Soluzione Backend
public function index(Request $request): JsonResponse {
    $perPage = $request->integer('per_page', 50);
    $page    = $request->integer('page', 1);

    return ApiResponse::success(
        Entrata::ofUser($user)
            ->orderBy('date', 'desc')
            ->paginate($perPage, ['*'], 'page', $page)
    );
}
```

```typescript
// Soluzione Frontend
const { data } = await fetchEntrate({ page: 1, per_page: 50 });
// Aggiungere cursore o paginazione UI nel TransactionsContext
```

#### 2. UNIT TEST FRONTEND (Priorità: ALTA)
Zero unit test sul frontend. I context con logica di cache e le funzioni API hanno bisogno di coverage.

```bash
npm install -D vitest @testing-library/react @testing-library/user-event
# Aggiungere test per:
# - UserContext.loadUser() e cache invalidation
# - TransactionsContext.refresh()
# - lib/api/http.ts (error handling, 401 redirect)
# - Zod schemas di validazione form
```

#### 3. REFRESH TOKEN MECHANISM (Priorità: ALTA)
La sessione NextAuth dura 30 giorni ma il token backend non ha refresh. Gli utenti vengono loggati out a sorpresa.

```typescript
// lib/auth/authOptions.ts — aggiungere nel jwt callback
async jwt({ token, account }) {
  if (token.expiresAt && Date.now() < token.expiresAt) return token;
  // Chiamare POST /api/v1/refresh-token
  const refreshed = await refreshAccessToken(token.refreshToken);
  return { ...token, ...refreshed };
}
```

#### 4. FIX DEMO USER PROTECTION (Priorità: MEDIA)
```php
// Migration da aggiungere
Schema::table('users', function (Blueprint $table) {
    $table->boolean('is_demo')->default(false);
});

// Middleware — sostituire string-match
if ($user->is_demo) { // invece di: if ($user->email === 'demo@synapsy.app')
    return response()->json(['message' => 'Demo user cannot modify data'], 403);
}
```

#### 5. CSP HEADERS + SECURITY HEADERS (Priorità: MEDIA)
```javascript
// next.config.js
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline';" },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];
```

### Refactoring consigliati

- **Consolidare gli skeleton** in un unico componente `<SkeletonList rows={n} />` riusabile
- **Creare `api/transactions.ts`** unificato invece di avere Entrate e Spese come client separati
- **Unificare i tipi TypeScript** con generazione automatica da OpenAPI (backend → frontend type safety end-to-end)
- **Estrarre `usePagination` hook** per gestire page/per_page nei context di Entrate/Spese
- **Mobile**: completare il CRUD reale sostituendo i placeholder

### Feature mancanti o incomplete

| Feature | Stato | Note |
|---|---|---|
| ML categoria suggerita | Incompleto | Flag env presente, endpoint doc ma no implementazione client |
| Ricerca/filtro transazioni | Assente | Solo filtro per data, manca ricerca testuale |
| Export CSV/PDF | Assente | Comune nelle app finanziari |
| Grafici interattivi | Parziale | Chart.js integrato ma usato minimalmente |
| Notifiche push mobile | Assente | Expo Notifications pronto da aggiungere |
| Offline sync mobile | Assente | Zustand + MMKV potrebbe gestirlo |
| Webhook/integrazioni esterne | Assente | Es. import da banca |

### Migliori pratiche non ancora adottate

- **OpenAPI/Swagger** per documentazione API auto-generata (attualmente solo Markdown manuale)
- **Conventional commits enforced** (gitlint o commitlint) — attualmente solo by convention
- **CI/CD pipeline** — nessun file GitHub Actions o equivalente trovato
- **Error monitoring** (Sentry) — nessuna integrazione trovata
- **Database indexing** esplicito nelle migration per campi frequentemente queryati (user_id, date, category_id)

---

## 10. PROSSIMI PASSI SUGGERITI

### Roadmap tecnica consigliata

| # | Intervento | Complessità | Impatto |
|---|---|---|---|
| 1 | Paginazione API (backend + frontend context) | MEDIA | CRITICO |
| 2 | Unit test frontend (Vitest + Testing Library) | MEDIA | ALTA |
| 3 | Refresh token rotation (backend + NextAuth) | ALTA | ALTA |
| 4 | Fix is_demo flag su DB | BASSA | MEDIA |
| 5 | Security headers CSP nel Next.js config | BASSA | MEDIA |
| 6 | CI/CD pipeline (GitHub Actions) | MEDIA | ALTA |
| 7 | Error monitoring (Sentry) | BASSA | MEDIA |
| 8 | Export transazioni (CSV/PDF) | MEDIA | MEDIA |
| 9 | Ricerca/filtro testuale transazioni | MEDIA | ALTA |
| 10 | Completamento Mobile (CRUD reali) | ALTA | ALTA |
| 11 | Grafici avanzati (Chart.js interattivi) | MEDIA | MEDIA |
| 12 | OpenAPI/Swagger auto-generato | BASSA | BASSA |
| 13 | ML suggerimento categoria (completamento) | ALTA | BASSA |
| 14 | useMemo sui context value objects | BASSA | BASSA |

### Dettaglio complessità

- **BASSA** (< 1 giorno): security headers, is_demo flag migration, Sentry integration, useMemo fix
- **MEDIA** (1-5 giorni): paginazione completa, unit test setup, export CSV, CI/CD pipeline, ricerca transazioni
- **ALTA** (> 5 giorni): refresh token mechanism, completamento Mobile, ML feature

---

## NOTE FINALI

Il progetto è ben strutturato e dimostra una buona maturità architetturale: moduli Laravel separati, TypeScript strict, auth flow robusto, documentazione abbondante. I punti critici sono legati alla scalabilità (paginazione), alla qualità (test frontend) e all'esperienza utente mobile ancora incompleta. Con 2-3 sprint di lavoro focalizzato sulle priorità 1-5, il progetto raggiungerebbe una solidità production-grade completa.

---

*Scheda generata da Claude Code — analisi su 50+ file sorgente*
