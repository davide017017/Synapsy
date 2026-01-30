<?php

declare(strict_types=1);

namespace Modules\User\Services;

use Illuminate\Support\Facades\DB;
use Modules\User\Models\User;
use Modules\Categories\Services\CreateDefaultCategoriesForUser;

// ────────────────────────────────────────────────────────────────
// CreateUserWithDefaults — crea utente + bootstrap dati minimi
// ────────────────────────────────────────────────────────────────
class CreateUserWithDefaults
{
  public static function run(
    array $data,
    bool $emailVerified = false,
    bool $isAdmin = false
  ): User {

    if (!isset($data['name'], $data['email'], $data['username'], $data['password'])) {
      throw new \InvalidArgumentException('Dati utente incompleti');
    }

    $user = User::create([
      'name'     => $data['name'],
      'surname'  => $data['surname'] ?? null,
      'email'    => $data['email'],
      'username' => $data['username'],
      'password' => bcrypt($data['password']),
      'theme'    => $data['theme'] ?? null,
      'avatar'   => $data['avatar'] ?? null,
      'has_accepted_terms' => $data['has_accepted_terms'] ?? false,
      'is_admin'          => $isAdmin,
      'email_verified_at' => $emailVerified ? now() : null,
    ]);

    // bootstrap dati
    CreateDefaultCategoriesForUser::run($user);

    return $user;
  }
}
