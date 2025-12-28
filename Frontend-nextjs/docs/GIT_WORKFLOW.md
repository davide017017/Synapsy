# Workflow Git Synapsy — Main → Beta → Prod

Questo documento descrive il **workflow Git ufficiale** usato nel progetto **Synapsy**.

L’obiettivo è:

-   lavorare **solo su `main`**
-   usare `beta` come **staging**
-   usare `prod` come **produzione**
-   evitare merge complessi e conflitti

---

## Regole fondamentali

-   ❌ **NON lavorare direttamente su `beta` o `prod`**
-   ❌ **NON usare `git merge` su `beta` o `prod`**
-   ✅ Tutto il codice nasce su **`main`**
-   ✅ `beta` e `prod` vengono **allineati forzatamente** (reset hard)

Schema mentale:

main → beta → prod
(reset) (reset)

yaml
Copia codice

---

## Flusso standard di lavoro

### 1. Sviluppo (sempre su `main`)

```bash
git checkout main
# lavori sul codice
git add .
git commit -m "descrizione commit"
git push
2. Aggiornare beta (renderla identica a main)
bash
Copia codice
git sync-beta
Alias equivalente (interno):

bash
Copia codice
git fetch origin
git checkout beta
git reset --hard origin/main
git push --force-with-lease origin beta
Risultato:

beta = main

stato pulito

nessun merge, nessun conflitto

3. Aggiornare prod (renderla identica a beta)
bash
Copia codice
git sync-prod
Alias equivalente (interno):

bash
Copia codice
git fetch origin
git checkout prod
git reset --hard origin/beta
git push --force-with-lease origin prod
Risultato:

prod = beta = main

produzione aggiornata

Alias Git usati (globali)
Questi alias sono configurati una sola volta sul computer:

bash
Copia codice
git config --global alias.sync-beta "!git fetch origin && git checkout beta && git reset --hard origin/main && git push --force-with-lease origin beta"
git config --global alias.sync-prod "!git fetch origin && git checkout prod && git reset --hard origin/beta && git push --force-with-lease origin prod"
Verifica:

bash
Copia codice
git config --global --get alias.sync-beta
git config --global --get alias.sync-prod
Perché NON usare git merge
merge può:

creare conflitti inutili

lasciare file locali sporchi

rompere l’allineamento tra branch

Il reset hard garantisce:

stato identico tra branch

storia lineare

zero sorprese

Gestione problemi comuni
File modificati / deleted / untracked che bloccano merge
👉 NON risolvere a mano

Usare sempre:

bash
Copia codice
git reset --hard origin/<branch>
Stash dimenticati
Controllo:

bash
Copia codice
git stash list
Pulizia completa:

bash
Copia codice
git stash clear
Stato corretto finale
bash
Copia codice
git log --oneline --decorate -3
Esempio corretto:

bash
Copia codice
(HEAD -> prod, origin/prod, origin/beta, origin/main, main, beta)
TL;DR ultra-compatto
r
Copia codice
• sviluppo → main
• staging  → git sync-beta
• prod     → git sync-prod
• mai merge su beta/prod
```

---

Ultra-breve, da memoria 👇

Quando hai finito di lavorare (sei su main)
git add .
git commit -m "msg"
git push

Per aggiornare beta
git sync-beta

Per aggiornare prod
git sync-prod

Stop. Nient’altro.
❌ mai git merge
❌ mai lavorare su beta o prod

Se vuoi ancora più corto:

lavoro → main
test → git sync-beta
live → git sync-prod
