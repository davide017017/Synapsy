# Constraints & Index Suggestions

- Add foreign keys where missing:
  - `entrate.category_id` → `categories.id`
  - `spese.category_id` → `categories.id`
  - `recurring_operations.category_id` → `categories.id`
  - `entrate.user_id`, `spese.user_id`, `recurring_operations.user_id` → `users.id`
- Add composite indexes:
  - `entrate` / `spese` / `transactions`: `(user_id, date)` for dashboard queries.
  - `financial_snapshots`: unique `(user_id, date)` or `(user_id, period_type, period_start_date)` (already present but ensure DB). 
  - `categories`: `(user_id, name)` unique already; consider index on `type`.
- Add CHECK constraints:
  - `transactions.type` in (`entrata`,`spesa`) when unified.
- Data types:
  - Monetary fields as `DECIMAL(12,2)`.
  - Use `NOT NULL` defaults where appropriate (e.g., `description`, `amount`, `date`).
- Eager loading:
  - Ensure controllers/services call `with('category')` to avoid N+1.
