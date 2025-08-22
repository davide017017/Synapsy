# Possibly Unused Tables

| Table | Reason | Verification |
|-------|--------|--------------|
| sessions | Used only when `session.driver=database`. Check `config/session.php` and `.env`. |
| cache / cache_locks | Required only when `cache.driver=database`. Inspect `config/cache.php`. |
| audit_logs | Ensure middleware/service writes entries; otherwise table remains empty. |
| financial_snapshots | Populated by scheduled job; verify task scheduler. |
