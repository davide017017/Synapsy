<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

/**
 * Layout per le pagine pubbliche / guest.
 * Usato come <x-guest-layout> nelle view.
 */
class GuestLayout extends Component
{
    public function render(): View
    {
        return view('layouts.guest');
    }
}
