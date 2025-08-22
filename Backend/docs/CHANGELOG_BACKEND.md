<!-- ─────────────────────────────────────────────────────────────────────────────
  Documento: CHANGELOG_BACKEND.md
  Scopo: registro modifiche backend (formato sintetico)
────────────────────────────────────────────────────────────────────────────── -->

# Backend Changelog

## [Unreleased]

-   Docs riorganizzate (alias per Auth e Data Models; guida migrazioni in `db/`).
-   ERD/relazioni consolidate sotto `docs/db/`.
-   Migliorie commenti e coerenza sezioni.

## 2025-08-22

-   Aggiunta documentazione DB (ERD, overview, renaming plan, constraints, unused).
-   Local scopes e cleanup PSR-12 in Category/Entrata/Spesa.
-   Eager loading in servizi per ridurre N+1.
