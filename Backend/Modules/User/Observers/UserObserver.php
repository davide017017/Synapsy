<?php

namespace Modules\User\Observers;

use Modules\User\Models\User;

/**
 * UserObserver
 * - Imposta avatar di default
 * - Assegna categorie standard complete (name, type, color, icon)
 */
class UserObserver
{
  public function created(User $user): void
  {
    return; // ⛔ TEMPORANEALEMENTE DISABILITATO ⛔
    // --------------------------------------------------
    // Skip durante i test
    // --------------------------------------------------
    if (app()->runningUnitTests()) {
      return;
    }

    // --------------------------------------------------
    // Avatar di default
    // --------------------------------------------------
    if (! $user->avatar) {
      $user->avatar = 'images/avatars/avatar_01_boy.webp';
      $user->save();
    }

    // --------------------------------------------------
    // Theme di default
    // --------------------------------------------------
    if (! $user->theme) {
      $user->theme = 'dark';
      $user->save();
    }

    // --------------------------------------------------
    // ❌ CATEGORIE DISABILITATE
    // Le categorie vengono create ESPLICITAMENTE
    // dal service CreateUserWithDefaults
    // --------------------------------------------------
  }
}
