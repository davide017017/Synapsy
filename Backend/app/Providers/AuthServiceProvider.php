<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Mappa globale Modello => Policy.
     * ⚠️ Attualmente vuota perché tutte le policy sono registrate nei rispettivi moduli.
     * Questo è un placeholder utile se in futuro si vogliono definire policy per modelli in App\Models.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Esempio:
        // \App\Models\User::class => \App\Policies\UserPolicy::class,
    ];

    /**
     * Registra policy e gate globali.
     */
    public function boot(): void
    {
        // Laravel registra automaticamente le policy elencate sopra.
        // Puoi anche definire qui dei Gate globali se necessario.
    }
}

