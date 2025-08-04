<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    // ================================================================
    // SCHERMATA REGISTRAZIONE
    // ================================================================

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    // ================================================================
    // REGISTRAZIONE NUOVO UTENTE
    // ================================================================

    public function test_new_users_can_register(): void
    {
        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->post('/register', [
                '_token'                 => 'test_csrf_token',
                'name'                   => 'Test User',
                'username'               => 'testuser',
                'email'                  => 'test@example.com',
                'has_accepted_terms'     => '1',
                'password'               => 'password',
                'password_confirmation'  => 'password',
            ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}

