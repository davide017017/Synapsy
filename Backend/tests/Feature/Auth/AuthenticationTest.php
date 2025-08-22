<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Models\User;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    // ================================================================
    // LOGIN SCREEN
    // ================================================================

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    // ================================================================
    // LOGIN SUCCESS
    // ================================================================

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);
        $response = $this->get('/dashboard'); // sostituisci con una rotta protetta reale

        $this->assertAuthenticatedAs($user);
        $response->assertOk();
    }

    // ================================================================
    // LOGIN FALLITO
    // ================================================================

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    // ================================================================
    // LOGOUT
    // ================================================================

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->assertAuthenticatedAs($user);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->post(route('logout'), ['_token' => 'test_csrf_token']);

        $response->assertRedirect('/');
        $this->assertGuest();
    }
}
