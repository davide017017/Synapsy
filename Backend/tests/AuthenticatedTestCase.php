<?php

namespace Tests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Modules\User\Models\User;

abstract class AuthenticatedTestCase extends TestCase
{
    use RefreshDatabase;

    /** @var User|Authenticatable */
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Creazione utente per i test
        $this->user = User::factory()->create();

        // Autenticazione via Sanctum
        Sanctum::actingAs(
            $this->user,
            ['*'],    // abilità wildcard
            'sanctum' // utilizza il guard Sanctum
        );
    }
}
