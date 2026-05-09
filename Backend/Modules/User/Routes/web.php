<?php

use Illuminate\Support\Facades\Route;
use Modules\RecurringOperations\Http\Controllers\RecurringOperationController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\User\Http\Controllers\ProfileController;

Route::middleware(['web'])->group(function () {

  require __DIR__ . '/auth.php';

  // ─────────────────────────────────────────
  // Preview email auth Synapsy - solo locale
  // ─────────────────────────────────────────
  Route::get('/preview-email-auth/{type}', function (string $type) {
    abort_unless(app()->environment('local'), 403);

    $data = match ($type) {
      'verify' => [
        'url' => '#',
        'title' => 'Conferma accesso al Neural Core',
        'buttonText' => 'Verifica email',
        'intro' => 'Ciao Davide, manca solo un piccolo commit: verifica la tua email per attivare l’account.',
      ],

      'reset' => [
        'url' => '#',
        'title' => 'Reset credenziali richiesto',
        'buttonText' => 'Reimposta password',
        'intro' => 'Abbiamo ricevuto una richiesta per reimpostare la password. Se sei stato tu, procedi da qui.',
      ],

      'new-email' => [
        'url' => '#',
        'title' => 'Nuova email in attesa di conferma',
        'buttonText' => 'Conferma email',
        'intro' => 'Per completare la modifica, conferma questo nuovo indirizzo email.',
      ],

      default => abort(404),
    };

    return view('user::emails.verify', $data);
  });

  // Dashboard (solo auth per ora)
  Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth')
    ->name('dashboard');

  // Rotte profilo e altro
  Route::middleware(['auth', 'verified', 'block-demo-user'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/recurring-operations', [RecurringOperationController::class, 'index'])
      ->name('recurring-operations.index');
  });
});
