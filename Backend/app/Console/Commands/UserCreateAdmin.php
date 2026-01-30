<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Throwable;
use Modules\User\Services\CreateUserWithDefaults;

class UserCreateAdmin extends Command
{
  // ─────────────────────────────────────────────
  // Signature: parametri CLI
  // ─────────────────────────────────────────────
  protected $signature = 'user:create-admin
        {email : Email utente}
        {username : Username}
        {password : Password}
        {--name=Davide : Nome}
        {--surname= : Cognome}
        {--theme=dark : Theme}
        {--avatar=avatar_01_boy.webp : Avatar filename}
        {--verify=1 : 1=email verified subito}
        {--admin=1 : 1=admin}';

  protected $description = 'Crea un utente admin con defaults (categorie) e stampa errori completi (debug prod-safe).';

  // ─────────────────────────────────────────────
  // Handle
  // ─────────────────────────────────────────────
  public function handle(): int
  {
    dump('default_db', config('database.default'));
    dump('connections', array_keys(config('database.connections')));

    $payload = [
      'name' => (string) $this->option('name'),
      'surname' => (string) ($this->option('surname') ?: ''),
      'email' => (string) $this->argument('email'),
      'username' => (string) $this->argument('username'),
      'password' => (string) $this->argument('password'),
      'theme' => (string) $this->option('theme'),
      'avatar' => (string) $this->option('avatar'),
      'has_accepted_terms' => true,
    ];

    $verify = (bool) ((int) $this->option('verify'));
    $admin  = (bool) ((int) $this->option('admin'));

    try {
      $user = CreateUserWithDefaults::run($payload, $verify, $admin);

      $this->info("✅ Creato user ID={$user->id} email={$user->email} admin=" . (int)$user->is_admin);
      dump(app('db')->select("select id,email,username,deleted_at from public.users order by id desc limit 3"));


      return self::SUCCESS;
    } catch (Throwable $e) {
      // ─────────────────────────────────────────
      // Stampa ERRORE VERO (quello che ci manca)
      // ─────────────────────────────────────────
      $this->error("❌ ERRORE: " . $e->getMessage());
      $this->line($e->getTraceAsString());

      return self::FAILURE;
    }
  }
}

/* ------------------------------------------------------
Descrizione file:
UserCreateAdmin.php: comando CLI per creare un utente (admin opzionale)
usando CreateUserWithDefaults e stampare lo stacktrace completo in caso
di errori, utile per diagnosticare i fallimenti in transaction su Postgres.
------------------------------------------------------ */
