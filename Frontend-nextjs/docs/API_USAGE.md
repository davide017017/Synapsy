# 🔌 API Usage

Esempi di chiamate alle API dal frontend.

---

## useFetch Hook
```ts
const { data, error } = useFetch('/api/v1/spese')
```

## Gestione errori
- gli errori di rete vengono intercettati e mostrati tramite toast
- token scaduto ➜ reindirizzamento a `/login`

## Esempio POST
```ts
await api.post('/api/v1/entrate', { amount: 100 })
```
