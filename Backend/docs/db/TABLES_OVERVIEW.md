# Tables Overview

| Table | Purpose | Key Columns | FKs | Indexes | Used by |
|-------|---------|-------------|-----|---------|---------|
| users | Anagrafica utenti e credenziali | id, username, email, is_admin, deleted_at | - | email unique, username unique | User module |
| password_reset_tokens | Token reset password | email, token | email→users.email | - | Auth scaffolding |
| sessions | Sessioni persistite (driver database) | id, user_id, payload | user_id→users.id | last_activity | Laravel session driver |
| categories | Categorie per entrate/spese | id, user_id, name, type | user_id→users.id | unique(user_id,name) | Category model/service |
| entrate | Movimenti di entrata | id, user_id, category_id, amount, date | user_id→users.id, category_id→categories.id | index(date), unique(user_id,date,description) | Entrata model/service |
| spese | Movimenti di spesa | id, user_id, category_id, amount, date | user_id→users.id, category_id→categories.id | index(date), unique(user_id,date,description) | Spesa model/service |
| recurring_operations | Operazioni ricorrenti | id, user_id, category_id, type, amount, next_occurrence_date | user_id→users.id, category_id→categories.id | index(next_occurrence_date), index(user_id,is_active) | RecurringOperation model/service |
| financial_snapshots | Snapshot aggregati | id, user_id, period_type, period_start_date | user_id→users.id | unique(user_id,period_type,period_start_date) | FinancialSnapshot model/service |
| audit_logs | Audit delle azioni | id, user_id, action, auditable_type, auditable_id | user_id→users.id | - | AuditLog model/service |
| cache | Cache applicativa | key, value, expiration | - | primary key(key) | Cache subsystem |
| cache_locks | Lock cache | key, owner, expiration | - | primary key(key) | Cache subsystem |
| jobs | Coda lavori | id, queue, attempts, available_at | - | queue index | Queue system |
| job_batches | Batch lavori | id, name, total_jobs | - | primary key(id) | Queue batch system |
| failed_jobs | Job falliti | id, uuid, payload | - | unique(uuid) | Queue system |
| personal_access_tokens | API tokens | id, tokenable_id, name, token | tokenable_id→users.id | index(token), unique(name,tokenable_id) | Sanctum |
| migrations | Tracking migrazioni | id, migration, batch | - | - | Framework |
