# 🗃️ Data Models

Principali entità del sistema e relative relazioni.

---

| Modello | Campi chiave | Relazioni |
|---------|--------------|-----------|
| `User` | id, name, email, password | hasMany Entrate, hasMany Spese |
| `Entrata` | id, user_id, amount, date | belongsTo User, belongsTo Category |
| `Spesa` | id, user_id, amount, date | belongsTo User, belongsTo Category |
| `Category` | id, user_id, name, type | hasMany Entrate/Spese |
| `RecurringOperation` | id, user_id, type, interval | belongsTo User |
| `FinancialOverview` | id, user_id, month, balance | belongsTo User |

Esempio risposta JSON per una spesa:
```json
{
  "id": 1,
  "amount": 99.00,
  "category": {"id":2,"name":"Shopping"},
  "created_at": "2025-01-01"
}
```
