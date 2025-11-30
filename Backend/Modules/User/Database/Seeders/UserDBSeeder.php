<?php

namespace Modules\User\Database\Seeders;

use App\Traits\LogsSeederOutput;
use App\Traits\TruncatesTable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\User\Models\User;

class UserDBSeeder extends Seeder
{
  use LogsSeederOutput, TruncatesTable;

  public function run(): void
  {
    $this->initOutput();

    // =========================================================================
    // 🔄 Pulizia tabella
    // =========================================================================
    $this->logInfo('User', 'Pulizia tabella `users`...', '🧹');
    $this->clearTable(User::class);

    // =========================================================================
    // 👤 Creazione utente admin
    // =========================================================================
    $this->logInfo('User', 'Creazione utente admin: test@example.com', '👤');
    User::updateOrCreate(
      ['email' => 'test@example.com'],
      [
        'name' => 'Test',
        'surname' => 'Admin',
        'username' => 'admin',
        'theme' => 'solarized',
        'avatar' => 'avatar_15_business.webp',
        'password' => Hash::make('password1234'),
        'email_verified_at' => now(),
        'remember_token' => Str::random(10),
        'is_admin' => true,
        'has_accepted_terms' => true,
      ]
    );

    // =========================================================================
    // 🧪 Generazione utenti fittizi
    // =========================================================================
    $this->logInfo('User', 'Generazione 1 utente demo...', '🧪');
    User::factory()->create(['has_accepted_terms' => true]);

    // =========================================================================
    // ✅ Fine seeding
    // =========================================================================
    $this->logSuccess('User', 'Seeder completato.');
    $this->logNewLine();
  }
}
