# Data Flow Audit Report

## Executive summary
Synapsy mixes Laravel backend modules with Next.js and Expo clients. Most list endpoints filter and sort at the database but return **unpaginated collections**. Front‑end layers then load the full dataset and run heavy `filter/sort/reduce` logic ("tutto e poi filtrare"). This wastes bandwidth and prevents scalable performance. Database tables lack composite indexes on common lookup keys, while some API routes (e.g. `next-occurrences`) are declared but not implemented.

## Endpoint map
| Method | Path | Controller@action | Auth | Filters | Sort | Pagination | Aggregations | Server-side vs Client | Notes |
|---|---|---|---|---|---|---|---|---|---|
| GET | `/v1/spese` | SpeseController@indexApi | sanctum | start_date,end_date,description,category_id | sort_by & direction (free) | ✖ | none | Mixed ⚠ | returns entire list, no per_page【F:Backend/Modules/Spese/Services/SpeseService.php†L21-L47】|
| GET | `/v1/entrate` | EntrateController@indexApi | sanctum | start_date,end_date,description,category_id | sort_by & direction (free) | ✖ | none | Mixed ⚠ | unpaginated list【F:Backend/Modules/Entrate/Services/EntrateService.php†L21-L47】|
| GET | `/v1/categories` | CategoriesController@indexApi | sanctum | none | sort_by=name/type | ✖ | none | Client-heavy ✖ | client splits types【F:Backend/Modules/Categories/Services/CategoryService.php†L21-L26】【F:Frontend-nextjs/app/(protected)/categorie/list/CategoriesList.tsx†L21-L22】|
| GET | `/v1/recurring-operations` | RecurringOperationController@index | sanctum | date range, description, category_id, type, is_active | sort_by whitelist | ✖ | none | Mixed ⚠ | filters exist but dataset returned whole【F:Backend/Modules/RecurringOperations/Services/RecurringOperationService.php†L23-L61】|
| GET | `/v1/financialoverview` | FinancialOverviewController@indexApi | sanctum | start_date,end_date | sort_by & direction | ✖ | sums in PHP | Client-heavy ✖ | merges all entries client-side【F:Backend/Modules/FinancialOverview/Services/FinancialOverviewService.php†L41-L60】|

## Backend analysis
- **Unpaginated queries**: services for Spese, Entrate, Categories and RecurringOperations all use `->get()` returning full collections【F:Backend/Modules/Spese/Services/SpeseService.php†L21-L47】【F:Backend/Modules/Entrate/Services/EntrateService.php†L21-L47】【F:Backend/Modules/Categories/Services/CategoryService.php†L21-L26】【F:Backend/Modules/RecurringOperations/Services/RecurringOperationService.php†L23-L61】.
- **Aggregations in PHP**: FinancialOverviewService loads all Entrate+Spese and merges/sorts in memory, then sums amounts in PHP【F:Backend/Modules/FinancialOverview/Services/FinancialOverviewService.php†L41-L66】.
- **Missing composite indexes**: migrations only index `date`; lack combined `user_id` indexes for time/category filters【F:Backend/Modules/Spese/Database/Migrations/2025_05_01_100200_create_spese_table.php†L24-L25】【F:Backend/Modules/Entrate/Database/Migrations/2025_05_01_100100_create_entrate_table.php†L38-L41】.
- **Routes without implementation**: `spese/next-occurrences` & `entrate/next-occurrences` routes map to missing controller methods【F:Backend/Modules/Spese/Routes/api.php†L14-L15】【F:Backend/Modules/Entrate/Routes/api.php†L14-L15】.

## Frontend web findings
| File | Function/Hook | URL base | Params passati | filter/sort/reduce? | Paginazione | Note |
|---|---|---|---|---|---|---|
| `context/contexts/TransactionsContext.tsx` | `fetchAll` | `/v1/financialoverview` | none | multiple `.filter`/`.reduce` for balances【F:Frontend-nextjs/context/contexts/TransactionsContext.tsx†L82-L122】 | ✖ | loads entire history |
| `lib/api/transactionsApi.ts` | `fetchTransactions` | `/v1/financialoverview` | fixed sort only | ✖ | ✖ | overfetch all transactions【F:Frontend-nextjs/lib/api/transactionsApi.ts†L11-L27】|
| `app/(protected)/categorie/list/CategoriesList.tsx` | component | data from `/v1/categories` | none | `.filter` + `.sort` per type【F:Frontend-nextjs/app/(protected)/categorie/list/CategoriesList.tsx†L21-L22】 | ✖ | split done client-side |
| `lib/api/ricorrenzeApi.ts` | `fetchRicorrenze` | `/v1/recurring-operations` | none | ✖ | ✖ | pulls all recurring ops【F:Frontend-nextjs/lib/api/ricorrenzeApi.ts†L39-L47】|

## Mobile findings
| File | Function | URL base | Params | Client work | Note |
|---|---|---|---|---|---|
| `src/features/transactions/api.ts` | `listTransactions` | `/spese` + `/entrate` | page, per_page | merges & sorts client side【F:Mobile/src/features/transactions/api.ts†L16-L25】 | backend ignores params |
| `src/features/categories/api.ts` | `listCategories` | `/categories` | page, per_page | none | params unused server-side【F:Mobile/src/features/categories/api.ts†L5-L7】 |

## Performance smell catalog
| Tipo | File:line | Descrizione breve | Impatto | Fix suggerito |
|---|---|---|---|---|
| Unpaginated query | SpeseService.php:47【F:Backend/Modules/Spese/Services/SpeseService.php†L47】 | Ritorna tutte le spese dell'utente | medio | usare `paginate()` + sort whitelist |
| Unpaginated query | EntrateService.php:47【F:Backend/Modules/Entrate/Services/EntrateService.php†L47】 | Ritorna tutte le entrate | medio | aggiungere `paginate()` |
| Unpaginated query | CategoryService.php:21-26【F:Backend/Modules/Categories/Services/CategoryService.php†L21-L26】 | tutte le categorie senza filtri | basso | permettere `type` e `paginate` |
| In-memory merge | FinancialOverviewService.php:41-60【F:Backend/Modules/FinancialOverview/Services/FinancialOverviewService.php†L41-L60】 | concat/sort in PHP | alto | usare query SQL o view/materialized |
| Client filtering | CategoriesList.tsx:21-22【F:Frontend-nextjs/app/(protected)/categorie/list/CategoriesList.tsx†L21-L22】 | split per tipo sul client | medio | `/v1/categories?type=` |
| Client reductions | TransactionsContext.tsx:82-122【F:Frontend-nextjs/context/contexts/TransactionsContext.tsx†L82-L122】 | calcoli saldi con `.filter/.reduce` | alto | endpoint dedicati per stats |
| Double fetch | mobile transactions/api.ts:16-25【F:Mobile/src/features/transactions/api.ts†L16-L25】 | due chiamate poi merge | medio | endpoint unico paginato |

## Prioritized action plan
1. **Introduce pagination & sort whitelists** for `/v1/spese` and `/v1/entrate` to prevent full-dataset transfers.
2. **Create paginated `/v1/transactions` endpoint** (or enhance `/financialoverview`) returning merged Entrate+Spese with SQL `UNION` and optional stats.
3. **Update clients** (web & mobile) to send `page`, `per_page`, date range, category and type filters; remove heavy client-side filters.
4. **Add composite indexes** on `(user_id,date)` and `(user_id,category_id,date)` for `entrate`/`spese`, plus `(user_id,next_occurrence_date)` for `recurring_operations`.
5. **Deprecate unused routes** (`next-occurrences`) or implement them.
6. **Move balance calculations server-side** using SQL aggregates or materialized snapshots.

## Proposed new endpoints / indexes
- `/v1/transactions`: GET with `type,start_date,end_date,category_id,sort,page,per_page` returning unified, paginated list.
- `/v1/transactions/stats`: aggregated sums per day/month.
- Add DB indexes: `(user_id, date)`, `(user_id, category_id, date)` on `spese` & `entrate`; `(user_id, next_occurrence_date)` on `recurring_operations`.

