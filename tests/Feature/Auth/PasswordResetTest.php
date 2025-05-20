<?php

namespace Tests\Feature\Auth;

use Modules\User\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    // ================================================================
    // SCHERMATA LINK RESET
    // ================================================================

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');
        $response->assertStatus(200);
    }

    // ================================================================
    // INVIO LINK RESET
    // ================================================================

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $this->withSession(['_token' => 'test_csrf_token'])
            ->post('/forgot-password', [
                '_token' => 'test_csrf_token',
                'email'  => $user->email,
            ]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    // ================================================================
    // SCHERMATA RESET CON TOKEN
    // ================================================================

    public function test_reset_password_screen_can_be_rendered(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->withSession(['_token' => 'test_csrf_token'])
            ->post('/forgot-password', [
                '_token' => 'test_csrf_token',
                'email'  => $user->email,
            ]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            $response = $this->get('/reset-password/' . $notification->token);
            $response->assertStatus(200);
            return true;
        });
    }

    // ================================================================
    // RESET CON TOKEN VALIDO
    // ================================================================

    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'password' => bcrypt('old-password'),
        ]);

        $this->withSession(['_token' => 'test_csrf_token'])
            ->post('/forgot-password', [
                '_token' => 'test_csrf_token',
                'email'  => $user->email,
            ]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $response = $this
                ->withSession(['_token' => 'test_csrf_token'])
                ->post('/reset-password', [
                    '_token'                 => 'test_csrf_token',
                    'token'                  => $notification->token,
                    'email'                  => $user->email,
                    'password'               => 'new-password',
                    'password_confirmation' => 'new-password',
                ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect(route('login'));

            return true;
        });
    }
}
