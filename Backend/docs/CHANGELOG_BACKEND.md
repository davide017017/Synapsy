# Backend Changelog

## [Unreleased]
- Added database documentation (ERD, tables overview, renaming plan, constraints, unused tables).
- Introduced local query scopes and PSR-12 cleanup for Category, Entrata, Spesa models.
- Added eager loading in EntrateService and SpeseService to mitigate N+1 queries.
