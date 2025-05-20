<?php

use Illuminate\Support\Facades\Route;
use Modules\FinancialOverview\Http\Controllers\FinancialOverviewController; // Importa il controller del modulo FinancialOverview

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Qui puoi registrare le rotte web per il modulo "FinancialOverview". Queste
| rotte vengono caricate dal RouteServiceProvider del modulo all'interno
| di un gruppo che già  include il middleware "web".
|
*/

// Gruppo di rotte protette da autenticazione e verifica email.
// Assicura che solo gli utenti loggati e con email verificata possano accedere.
Route::middleware(['auth', 'verified'])->group(function () {

    // Rotta per la pagina della panoramica finanziaria.
    // Punta al metodo index del FinancialOverviewController.
    Route::get('/financial-overview', [FinancialOverviewController::class, 'index'])->name('financial-overview.index');

    // Puoi aggiungere qui altre rotte specifiche per la panoramica finanziaria se necessario,
    // ma per un'overview semplice, una singola rotta 'index' è comune.

});

// Puoi definire qui rotte non protette se necessario.
