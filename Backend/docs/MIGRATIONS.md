# 📦 Migrations

Gestione delle migrazioni del database.

---

## ▶️ Comandi utili
```bash
php artisan migrate        # applica le migrazioni
php artisan migrate:rollback  # annulla l'ultimo batch
php artisan migrate:fresh --seed  # ricrea il DB e popola i dati
```

## 🧪 Seeders
- definiti in `database/seeders`
- eseguiti con `php artisan db:seed`

## 🔁 Consigli
- versiona sempre le nuove migrazioni
- evita modifiche distruttive sui dati in produzione

---
Le migrazioni mantengono lo schema coerente tra ambienti.
