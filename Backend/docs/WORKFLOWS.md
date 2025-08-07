# 🔄 Workflows

Principali flussi d'uso lato backend.

---

## ➕ Creazione Spesa
1. Richiesta `POST /api/v1/spese`
2. Validazione dati e assegnazione categoria
3. Risposta JSON con spesa creata

## ♻️ Operazione Ricorrente
1. Job pianificato controlla le regole
2. Genera entrate/spese secondo l'intervallo
3. Log operazione in `recurring_operations`

## 📸 Snapshot Mensile
1. Cron job a fine mese
2. Calcola bilancio e salva in `financial_overviews`

---
Ogni workflow è progettato per essere idempotente e testabile.
