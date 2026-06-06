<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Throwable;
use Modules\User\Services\CreateUserWithDefaults;

class UserCreate extends Command
{
    protected $signature = 'user:create';

    protected $description = 'Crea un nuovo utente con categorie di default (ruolo: user).';

    public function handle(): int
    {
        $name     = $this->ask('Nome');
        $email    = $this->ask('Email');
        $username = $this->ask('Username');

        $password = $this->secret('Password');
        $confirm  = $this->secret('Conferma password');

        if ($password !== $confirm) {
            $this->error('Le password non corrispondono.');
            return self::FAILURE;
        }

        $payload = [
            'name'               => (string) $name,
            'email'              => (string) $email,
            'username'           => (string) $username,
            'password'           => (string) $password,
            'has_accepted_terms' => true,
        ];

        try {
            $user = CreateUserWithDefaults::run($payload, false, false);

            $this->info("Utente creato — ID={$user->id} email={$user->email}");

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Errore: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
