<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * Controller base dell'applicazione.
 *
 * Tutti i controller dell'app (compresi quelli nei moduli) dovrebbero
 * estendere questa classe per avere accesso alle funzionalità standard Laravel.
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}

