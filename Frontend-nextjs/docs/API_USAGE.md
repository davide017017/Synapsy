# 🔌 API Usage

Esempi di chiamate alle API dal frontend.

---

## useFetch Hook

```ts
const { data, error } = useFetch("/api/v1/spese");
```

## Gestione errori

-   gli errori di rete vengono intercettati e mostrati tramite toast
-   token scaduto ➜ reindirizzamento a `/login`

## Esempio POST

```ts
await api.post("/api/v1/entrate", { amount: 100 });
```

## Transaction data

Le transazioni vengono fornite dal `TransactionsContext`.

```ts
import { useTransactions } from "@/context/TransactionsContext";
const { transactions, loading, error } = useTransactions();
```

Utilizza questo contesto condiviso invece di effettuare fetch manuali.
