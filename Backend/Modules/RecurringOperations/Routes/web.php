<?php

use Illuminate\Support\Facades\Route;
// Importa il controller del modulo RecurringPayments (lo creeremo nel prossimo passaggio)
use Modules\RecurringOperations\Http\Controllers\RecurringOperationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Qui puoi registrare le rotte web per il modulo "RecurringPayments". Queste
| rotte vengono caricate dal RouteServiceProvider del modulo all'interno
| di un gruppo che già  include il middleware "web".
|
*/

// Gruppo di rotte protette da autenticazione e verifica email.
// Assicura che solo gli utenti loggati e con email verificata possano accedere alle rotte delle operazioni ricorrenti.
Route::middleware(['auth', 'verified'])->group(function () {

    // Definizione delle rotte RESTful standard per la risorsa 'recurring-operations'.
    // Questo crea automaticamente rotte per index, create, store, show, edit, update, destroy.
    // Il metodo ->names('recurring-operations') assegna nomi standard alle rotte
    // (es. 'recurring-operations.index', 'recurring-operations.create', ecc.).
    // Il prefisso URL sarà  '/recurring-operations'.
    Route::resource('recurring-operations', RecurringOperationController::class)->names('recurring-operations');

    // Puoi aggiungere qui altre rotte specifiche per le operazioni ricorrenti se necessario.
    // Esempio: Route::post('/recurring-operations/{recurring_operation}/generate-now', [RecurringOperationController::class, 'generateNow'])->name('recurring-operations.generateNow');

});

// Puoi definire qui rotte non protette se necessario, ma per le operazioni ricorrenti non è comune.
