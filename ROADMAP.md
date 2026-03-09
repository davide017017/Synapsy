# SYNAPSY FINANCE — Roadmap Tecnica

> Creata: 09 marzo 2026
> Fonte: analisi automatica `PROJECT_TECH_SHEET.md`
> Aggiornamento: manuale dopo ogni fix completato

---

## Come usare questa roadmap

- `- [ ]` = task da fare
- `- [x]` = task completato
- Le priorità sono ordinate: 🔴 CRITICO → 🟠 ALTO → 🟡 MEDIO → ⚪ BASSO

---

## 🔴 CRITICO — Paginazione API

> **Perché critico**: senza paginazione, un utente con 1.000+ transazioni riceve tutto in un payload. Performance degrada linearmente.

**Nota**: Entrate e Spese sono già paginate sul backend (supportano `?page=1&per_page=50` con backward compat). Mancano RecurringOperations e il frontend.

### Backend — RecurringOperations

**File coinvolti:**
- `Backend/Modules/RecurringOperations/Services/RecurringOperationService.php`
- `Backend/Modules/RecurringOperations/Http/Controllers/RecurringOperationController.php`

**Tempo stimato:** 1-2 ore

- [x] Aggiungere metodo `getFilteredAndSortedForUserPaginated()` nel service
- [x] Aggiornare `index()` nel controller per supportare `?page=1&per_page=50`
- [x] Mantenere backward compat (se non si passano page/per_page → risposta flat)

### Frontend — usePagination hook

**File coinvolti:**
- `Frontend-nextjs/hooks/usePagination.ts` (nuovo)
- `Frontend-nextjs/lib/api/transactionsApi.ts`
- `Frontend-nextjs/src/lib/api/endpoints.ts`

**Tempo stimato:** 2-3 ore

- [x] Creare hook `usePagination` riusabile (page, perPage, totalPages, goTo, next, prev)
- [x] Aggiornare `fetchTransactions` per supportare parametri di paginazione
- [x] Aggiungere endpoint `refreshToken` in endpoints.ts

---

## 🟠 ALTO — Unit Test Frontend

> **Perché alto**: `npm test` attualmente esegue `echo "No unit tests yet"`. La logica di cache e CRUD nei context non ha coverage.

**File coinvolti:**
- `Frontend-nextjs/vitest.config.ts` (nuovo)
- `Frontend-nextjs/tests/unit/` (nuova cartella)
- `Frontend-nextjs/package.json` (aggiornare script `test`)

**Dipendenze da installare:**
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

**Tempo stimato:** 3-4 ore

- [x] Creare `vitest.config.ts`
- [x] Aggiornare script `test` in `package.json`
- [x] Test per KPI di `TransactionsContext` (monthBalance, yearBalance, weekBalance, totalBalance)
- [x] Test per schema Zod (validazioni form transazioni e ricorrenze)
- [x] Test per `lib/finance.ts` (parseYMD, typeOf, toNum)

---

## 🟠 ALTO — Refresh Token

> **Perché alto**: Il JWT di NextAuth ha maxAge 15 min. Quando scade, il callback `jwt` viene ri-eseguito ma senza logica di refresh, se il token backend scade l'utente viene loggato out a sorpresa.

### Backend

**File coinvolti:**
- `Backend/Modules/User/Http/Controllers/ApiLoginController.php`
- `Backend/routes/api.php`

**Tempo stimato:** 1 ora

- [x] Aggiungere metodo `refreshToken()` in `ApiLoginController`
- [x] Aggiungere route `POST /api/v1/refresh-token` protetta da `auth:sanctum`

### Frontend

**File coinvolti:**
- `Frontend-nextjs/lib/auth/authOptions.ts`
- `Frontend-nextjs/src/lib/api/endpoints.ts`

**Tempo stimato:** 1-2 ore

- [x] Aggiungere endpoint `refreshToken` in `endpoints.ts`
- [x] Aggiornare `jwt` callback in `authOptions.ts` per rilevare scadenza e fare refresh automatico

---

## 🟡 MEDIO — Fix Demo User Protection

> **Perché medio**: il controllo `email === 'demo@synapsy.app'` è fragile. Aggiungere una colonna `is_demo` rende la protezione robusta e scalabile.

**File coinvolti:**
- `Backend/database/migrations/XXXX_add_is_demo_to_users_table.php` (nuovo)
- `Backend/Modules/User/Models/User.php`
- `Backend/app/Http/Middleware/PreventDemoUserModification.php`
- `Backend/Modules/User/Database/Seeders/DemoUserSeeder.php`

**Tempo stimato:** 30-60 min

- [x] Creare migration `add_is_demo_to_users_table`
- [x] Aggiungere `is_demo` a `$fillable` e `$casts` nel model User
- [x] Aggiornare middleware per usare `$user->is_demo` invece di string-match email
- [x] Aggiornare DemoUserSeeder per impostare `is_demo => true`

---

## 🟡 MEDIO — Security Headers CSP

> **Perché medio**: nessun Content Security Policy o header di sicurezza configurato. Aumenta la superficie di attacco XSS e clickjacking.

**File coinvolti:**
- `Frontend-nextjs/next.config.js`

**Tempo stimato:** 30 min

- [x] Aggiungere `Content-Security-Policy`
- [x] Aggiungere `X-Frame-Options: DENY`
- [x] Aggiungere `X-Content-Type-Options: nosniff`
- [x] Aggiungere `Referrer-Policy`
- [x] Aggiungere `Permissions-Policy`

---

## ⚪ BASSO — useMemo su Context Value Objects

> **Perché basso**: ogni render del provider ricrea un nuovo oggetto `value`, causando re-render non necessari in tutti i consumer. Facile fix con `useMemo`.

**File coinvolti:**
- `Frontend-nextjs/context/CategoriesContext.tsx`
- `Frontend-nextjs/context/RicorrenzeContext.tsx`
- `Frontend-nextjs/context/UserContext.tsx`
- `Frontend-nextjs/context/TransactionsContext.tsx` *(già usa useMemo per i KPI, manca il value)*

**Tempo stimato:** 30 min

- [x] Wrappare `value` in `useMemo` in `CategoriesContext`
- [x] Wrappare `value` in `useMemo` in `RicorrenzeContext`
- [x] Wrappare `value` in `useMemo` in `UserContext`
- [x] Wrappare `value` in `useMemo` in `TransactionsContext`

---

## Backlog (futuri sprint)

| Feature | Complessità | Note |
|---|---|---|
| CI/CD pipeline (GitHub Actions) | MEDIA | Build + test automatici su ogni PR |
| Error monitoring (Sentry) | BASSA | `npm install @sentry/nextjs` + wizard |
| Export transazioni CSV/PDF | MEDIA | Backend: endpoint export + Frontend: pulsante |
| Ricerca testuale transazioni | MEDIA | Backend: `?q=` param + Frontend: input di ricerca |
| Completamento Mobile CRUD | ALTA | Sostituire i placeholder con CRUD reali |
| OpenAPI/Swagger auto-generato | BASSA | `php artisan scribe:generate` o L5-Swagger |
| ML suggerimento categoria | ALTA | Richiede modello + endpoint + UI |
| Database indexing esplicito | BASSA | Aggiungere indici su `user_id, date, category_id` |

---

*Roadmap generata automaticamente da Claude Code — aggiornare le checkbox man mano che i task vengono completati.*
