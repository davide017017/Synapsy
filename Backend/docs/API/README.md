<!-- ─────────────────────────────────────────────────────────────────────────────
  Documento: docs/API/README.md
  Scopo: spiega come esportare le rotte API in JSON/MD
────────────────────────────────────────────────────────────────────────────── -->

# 📜 Esportazione Rotte API

Questi file sono **auto-generati** dai comandi Artisan sottostanti.

---

## ▶️ Comandi

```bash
# JSON → docs/API/ROUTES.json
php artisan routes:export-api-json --path=docs/API/ROUTES.json --prefix=/api/v1

# Markdown → docs/API/ROUTES.md
php artisan routes:export-api-md --path=docs/API/ROUTES.md --prefix=/api/v1
```

### ML Suggestion

- POST /api/v1/ml/suggest-category
- Body: { "description": "text" }
- Response: { "description": "...", "suggestion": { "category": "...", "confidence": 0.xx } }
- Avvio microservizio: vedere ml_category_suggester/README.md
