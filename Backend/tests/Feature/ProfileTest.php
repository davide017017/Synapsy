<?php

namespace Tests\Feature;

use Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    // ================================================================
    // SCHERMATA PROFILO
    // ================================================================

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);

        $response = $this->get('/profile');

        $response->assertStatus(200);
    }

    // ================================================================
    // AGGIORNAMENTO DATI PROFILO
    // ================================================================

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->patch('/profile', [
                '_token' => 'test_csrf_token',
                'name'   => 'Test User',
                'email'  => 'test@example.com',
            ]);

        $response->assertSessionHasNoErrors()
                ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertNotSame('test@example.com', $user->email);
        $this->assertSame('test@example.com', $user->pending_email);
        $this->assertNotNull($user->email_verified_at);
    }

    // ================================================================
    // EMAIL INVARIATA NON RESETTA VERIFICA
    // ================================================================

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->patch('/profile', [
                '_token' => 'test_csrf_token',
                'name'   => 'Test User',
                'email'  => $user->email,
            ]);

        $response->assertSessionHasNoErrors()
                ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    // ================================================================
    // CANCELLAZIONE ACCOUNT CON PASSWORD CORRETTA
    // ================================================================

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->delete('/profile', [
                '_token' => 'test_csrf_token',
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNotNull($user->fresh());
        $this->assertNotNull($user->fresh()->deleted_at);
    }

    // ================================================================
    // CANCELLAZIONE FALLISCE CON PASSWORD ERRATA
    // ================================================================

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);

        $response = $this
            ->withSession(['_token' => 'test_csrf_token'])
            ->from('/profile')
            ->delete('/profile', [
                '_token' => 'test_csrf_token',
                'password' => 'wrong-password',
            ]);

        $response->assertSessionHasErrorsIn('userDeletion', 'password')
                ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }
}

