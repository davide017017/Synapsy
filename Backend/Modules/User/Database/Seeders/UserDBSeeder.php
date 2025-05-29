<?php

namespace Modules\User\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\User\Models\User;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

class UserDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

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
        User::create([
            'name'              => 'Test User',
            'email'             => 'test@example.com',
            'email_verified_at' => now(),
            'password'          => Hash::make('password1234'),
            'remember_token'    => Str::random(10),
            'is_admin'          => true,
        ]);

        // =========================================================================
        // 🧪 Generazione utenti fittizi
        // =========================================================================
        $this->logInfo('User', 'Generazione 3 utenti fittizi...', '🧪');
        User::factory(3)->create();

        // =========================================================================
        // ✅ Fine seeding
        // =========================================================================
        $this->logSuccess('User', 'Seeder completato.');
        $this->logNewLine();
    }
}

