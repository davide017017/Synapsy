<?php

namespace Modules\User\Database\Seeders;

use App\Traits\LogsSeederOutput;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\User\Models\User;

class DemoUserSeeder extends Seeder
{
    use LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        // ================================================================
        // 👤 Creazione Demo User
        // ================================================================
        $this->logInfo('User', 'Creazione/aggiornamento utente demo', '👤');

        User::updateOrCreate(
            ['email' => 'demo@synapsy.app'],
            [
                'name' => 'Demo',
                'surname' => 'User',
                'username' => 'demo',
                'password' => Hash::make('demo'),
                'theme' => 'dark',
                'avatar' => 'avatar_12_pink_beta.webp',
                'is_admin' => false,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'has_accepted_terms' => true,
            ]
        );

        $this->logSuccess('User', 'Utente demo pronto.');
        $this->logNewLine();
    }
}
