# 🏗️ Architettura

Descrizione dell'architettura modulare di Synapsy Finance.

---

## 📦 Moduli
Ogni funzionalità è incapsulata in un modulo sotto `Modules/`:
- `Categories`
- `Entrate`
- `Spese`
- `RecurringOperations`
- `FinancialOverview`
- `User`

## 🗄️ Database
- PostgreSQL/SQLite
- schema ER semplificato:

![Schema ER](schema-er.png)

## 🔌 Services & Jobs
- Service class per logica di dominio
- Jobs/Queue per operazioni pianificate (ricorrenze)

## 🌐 Rotte
- Tutte le rotte API prefissate con `/api/v1`

---

L'architettura modulare consente di aggiungere nuovi domini in modo isolato.
