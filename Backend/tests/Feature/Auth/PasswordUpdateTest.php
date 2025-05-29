<?php

namespace Tests\Feature\Auth;

use Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    // ================================================================
    // PASSWORD AGGIORNATA CORRETTAMENTE
    // ================================================================

    public function test_password_can_be_updated(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->withSession(['_token' => 'test_csrf_token'])
            ->from('/profile')
            ->put('/password', [
                '_token'                => 'test_csrf_token',
                'current_password'      => 'password',
                'password'              => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    // ================================================================
    // PASSWORD NON AGGIORNATA SE ERRATA
    // ================================================================

    public function test_correct_password_must_be_provided_to_update_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->withSession(['_token' => 'test_csrf_token'])
            ->from('/profile')
            ->put('/password', [
                '_token'                => 'test_csrf_token',
                'current_password'      => 'wrong-password',
                'password'              => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasErrorsIn('updatePassword', 'current_password')
            ->assertRedirect('/profile');
    }
}
