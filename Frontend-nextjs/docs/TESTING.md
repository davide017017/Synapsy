# 🧪 Testing

Documentazione dei test frontend per Synapsy.  
Include panoramica, comandi rapidi ed esempi di debug.

---

## 📦 Stack di test

-   Playwright → test E2E / integrazione, mock API e smoke test
-   Jest + React Testing Library → previsto per unit test componenti (TODO)

Attualmente sono presenti solo test Playwright nella cartella `tests/`:

tests/  
├─ avatar.spec.ts # unit-like: funzione getAvatarUrl  
├─ navigation.spec.ts # smoke routing via sidebar (CSR)  
└─ crud.spec.ts # smoke CRUD con mock backend in-memory

---

## ⚙️ Setup

npm i  
npx playwright install

---

## 🚀 Esecuzione

Tutti i test:  
 npx playwright test

Un file specifico:  
 npx playwright test tests/crud.spec.ts

Filtra per titolo:  
 npx playwright test -g "CRUD smoke"

Modalità debug (browser visibile + inspector):  
 npx playwright test tests/crud.spec.ts -g "CRUD smoke" --headed --debug

Analisi fallimenti (Trace Viewer):

-   abilita trace su retry → npx playwright test --trace on-first-retry
-   apri un trace salvato → npx playwright show-trace test-results/<cartella>/trace.zip

---

## 🐞 Toggle di debug

Alcuni test stampano log extra se attivi variabili d’ambiente:

-   PW_DEBUG_CRUD=1 → log estesi per crud.spec.ts
-   PW_DEBUG_NAV=1 → log estesi per navigation.spec.ts

### Windows PowerShell

$env:PW_DEBUG_CRUD = "1"  
npx playwright test tests/crud.spec.ts -g "CRUD smoke" --headed --debug  
Remove-Item Env:\PW_DEBUG_CRUD

### macOS/Linux

PW_DEBUG_CRUD=1 npx playwright test tests/crud.spec.ts -g "CRUD smoke"

---

## 📑 Descrizione test

### avatar.spec.ts

-   Tipo: unit-like
-   Cosa fa: testa la funzione getAvatarUrl con casi tabellari e precedenze (avatarUrl > email > iniziali)
-   Utile per: garantire coerenza sugli avatar mostrati

---

### navigation.spec.ts

-   Tipo: smoke E2E (CSR)
-   Cosa fa: mocka la sessione e il profilo, poi naviga via sidebar → Home, Panoramica, Transazioni, Ricorrenti, Categorie, Profilo
-   Debug extra: screenshot + snippet HTML se fallisce la pagina profilo
-   Utile per: verificare che i link principali e il routing client-side funzionino

---

### crud.spec.ts

-   Tipo: smoke API
-   Cosa fa: monta pagina fittizia /\_\_noop, mocka backend in-memory per /api/v1/\*  
    Testa CRUD completo su categorie, entrate/spese, ricorrenze, profilo
-   Utile per: validare le chiamate API senza avviare backend reale
-   Debug extra: PW_DEBUG_CRUD=1 abilita log dettagliati su ogni route/mock

---

## ✅ Best practice

-   Metti unit test accanto ai componenti (Component.test.tsx), mentre i test E2E restano in tests/
-   Mantieni i mock in-memory con page.route(...)
-   Usa RegExp port-aware per intercettare URL con o senza :80
-   Catch-all sempre in fondo e in modalità fallback

---

**Descrizione file:**  
Questa guida unifica la documentazione dei test Playwright,
spiegando quali ci sono, come lanciarli,
a cosa servono e come abilitare il debug.  
Include sia i comandi rapidi che note avanzate per analisi e troubleshooting.
