# Deploy Synapsy Beta

## Backend (Render)
1. Creare un servizio web su Render collegando la cartella `Backend`.
2. Impostare le variabili d'ambiente usando `.env.example` come riferimento.
3. Comando di build: `composer install --no-dev && npm run build && php artisan migrate --force`.
4. Comando di avvio: `php artisan serve --host 0.0.0.0 --port 8484`.

## Frontend (Vercel)
1. Importare la cartella `Frontend-nextjs` su Vercel.
2. Copiare le variabili da `.env.example` e impostare `NEXT_PUBLIC_API_URL` con l'URL del backend.
3. Comando di build: `npm run build`.

## Database (PlanetScale)
Creare un database MySQL su PlanetScale e aggiornare le variabili `DB_*` del backend.

## AI Service (opzionale)
Se si utilizza `ai-service`, creare un servizio separato su Render e configurare le variabili necessarie.

## Backup
Si consiglia di abilitare backup automatici del database.

