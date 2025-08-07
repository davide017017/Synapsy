# 🔐 Auth Flow

Descrive il processo di autenticazione basato su **Laravel Sanctum**.

---

## 📝 Registrazione
`POST /api/register`
- crea un utente e restituisce un token Sanctum.

## 🔑 Login
`POST /api/login`
- verifica le credenziali e genera un token.

## 📡 Uso del token
- il token va inviato nell'header `Authorization: Bearer <token>`
- protegge tutte le rotte sotto `auth:sanctum`

## 🚪 Logout
`POST /api/logout`
- revoca il token corrente.

## ⏲️ Scadenza
- i token possono essere revocati manualmente o tramite job pianificati.

---

Esempio con `curl`:
```bash
curl -X POST https://api.example.com/api/login \
  -d 'email=user@example.com&password=secret'
```
