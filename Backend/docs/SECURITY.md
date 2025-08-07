# 🛡️ Security

Best practice di sicurezza adottate dal backend.

---

## 🔐 Autenticazione
- Laravel Sanctum con token personali
- Protezione CSRF per rotte web

## 🔒 Password
- Hash con `bcrypt`
- Politica di reset tramite email

## 🌍 CORS & Rate Limiting
- CORS configurato per il dominio frontend
- Limite richieste via `Throttle`

## 📜 Log & Privacy
- Log applicativi in `storage/logs`
- I dati sensibili non vengono mai salvati in chiaro

---
Mantieni aggiornate le dipendenze con `composer update`.
