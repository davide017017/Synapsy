# 🧩 Providers

Linee guida per l'uso dei contesti React.

-   **UserProvider**: montalo **una sola volta** in `app/providers.tsx`.
-   **CategoriesProvider** e **TransactionsProvider**: montali **solo** nell’area protetta, in `app/(protected)/layout.tsx`.
-   Evita di annidare o duplicare questi provider. Il nostro ESLint segnala se compaiono altrove.

> Montare ogni context al livello più alto necessario riduce rendering inutili e semplifica la manutenzione.

## Perché vietiamo i duplicati?

-   Evita più istanze di stato globale (cache incoerenti, race condition, fetch duplicati).
-   Comportamento prevedibile fra SSR/CSR e sotto‐alberi dell’app.

## Riepilogo posizionamento

| Provider               | Dove montare                 | Scope         |
| ---------------------- | ---------------------------- | ------------- |
| `UserProvider`         | `app/providers.tsx`          | App intera    |
| `CategoriesProvider`   | `app/(protected)/layout.tsx` | Area protetta |
| `TransactionsProvider` | `app/(protected)/layout.tsx` | Area protetta |
