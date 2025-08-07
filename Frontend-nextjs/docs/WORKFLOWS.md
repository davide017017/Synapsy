# 🔄 Workflows

Flussi utente principali nel frontend.

---

## 👤 Login
1. utente inserisce credenziali
2. chiamata API `/api/login`
3. redirect alla dashboard

## ➕ Nuova Transazione
1. click su "Aggiungi"
2. compilazione form
3. invio a `/api/v1/entrate|spese`
4. aggiornamento stato globale

## 📊 Overview finanziaria
1. caricamento dashboard
2. fetch di `/api/v1/financialoverview`
3. visualizzazione grafici

---
Ogni step mostra feedback tramite toast e loader.
