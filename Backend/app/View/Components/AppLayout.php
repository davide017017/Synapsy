<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

/**
 * Layout per le pagine con utente autenticato.
 * Usato come <x-app-layout> nelle view.
 */
class AppLayout extends Component
{
    public function render(): View
    {
        return view('layouts.app');
    }
}
