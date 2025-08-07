# 🚀 Deploy

Pubblicazione del frontend su Vercel o piattaforme simili.

---

## Vercel
1. Importa il progetto da GitHub selezionando la cartella `Frontend-nextjs`
2. Imposta le variabili d'ambiente (`NEXT_PUBLIC_API_URL`)
3. Comando di build: `npm run build`
4. Comando di start: automatico

## Variabili principali
| Nome | Descrizione |
|------|-------------|
| `NEXT_PUBLIC_API_URL` | URL delle API Laravel |
| `NEXT_PUBLIC_BETA` | abilita il login demo |

## Errori comuni
- API_URL errato ➜ schermata vuota
- mancata configurazione CORS sul backend

---
Per ambienti self-hosted usa `npm run build` e servi la cartella `.next`.
