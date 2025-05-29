<?php
use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\RecurringOperations\Http\Controllers\RecurringOperationController;



Route::middleware(['web'])->group(function () {

    require __DIR__.'/auth.php';
    
    // Dashboard (solo auth per ora)
    Route::get('/dashboard', DashboardController::class)
        ->middleware('auth')
        ->name('dashboard');

    // Rotte profilo e altro
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/recurring-operations', [RecurringOperationController::class, 'index'])
            ->name('recurring-operations.index');
    });
});
