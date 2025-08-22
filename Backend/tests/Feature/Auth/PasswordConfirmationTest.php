<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Models\User;
use Tests\TestCase;

class PasswordConfirmationTest extends TestCase
{
    use RefreshDatabase;

    // ================================================================
    // SCHERMATA CONFERMA PASSWORD
    // ================================================================

    public function test_confirm_password_screen_can_be_rendered(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/confirm-password');

        $response->assertStatus(200);
    }

    // ================================================================
    // CONFERMA PASSWORD VALIDA
    // ================================================================

    public function test_password_can_be_confirmed(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->actingAs($user)
            ->post('/confirm-password', [
                '_token' => 'test_csrf_token',
                'password' => 'password',
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    // ================================================================
    // CONFERMA PASSWORD NON VALIDA
    // ================================================================

    public function test_password_is_not_confirmed_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->actingAs($user)
            ->post('/confirm-password', [
                '_token' => 'test_csrf_token',
                'password' => 'wrong-password',
            ]);

        $response->assertSessionHasErrors('password');
    }
}
