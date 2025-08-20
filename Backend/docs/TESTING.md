# 🧪 Testing

Guida ai test automatici dell'API.

---

## ▶️ Esecuzione

```bash
php artisan test       # tutti i test
php artisan test --coverage  # con report di copertura
```

# ── Run VELOCE senza Xdebug (CLI/test) ──────────────────────────────────────

#$env:XDEBUG_MODE = "off"; php artisan test

## 📁 Struttura

-   `tests/Feature` per test end-to-end delle rotte
-   `tests/Unit` per logica isolata
-   `Modules/*/tests` per test dei singoli moduli

## ✍️ Scrivere nuovi test

-   usa `php artisan make:custom-api-test NomeTest`
-   nomina i metodi con `test_`
-   verifica le risposte JSON e gli status code

## ❓ FAQ

-   **Database:** usa SQLite in memoria configurato in `phpunit.xml`
-   **Coverage HTML:** `php artisan test --coverage-html coverage`
