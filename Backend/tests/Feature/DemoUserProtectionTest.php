<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Modules\User\Models\User;
use Tests\TestCase;

class DemoUserProtectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_update_profile(): void
    {
        $user = User::factory()->demo()->create();
        Sanctum::actingAs($user);

        $this->putJson('/api/v1/profile', ['name' => 'Hacker', 'email' => $user->email])
            ->assertStatus(403);
    }

    public function test_cannot_delete_profile(): void
    {
        $user = User::factory()->demo()->create(['password' => bcrypt('password')]);
        Sanctum::actingAs($user);

        $this->deleteJson('/api/v1/profile', ['password' => 'password'])
            ->assertStatus(403);
    }

    public function test_cannot_change_password(): void
    {
        $user = User::factory()->demo()->create(['password' => bcrypt('password')]);
        Sanctum::actingAs($user);

        $this->putJson('/api/v1/profile/change-password', [
            'current_password'      => 'password',
            'password'              => 'NewPass123!',
            'password_confirmation' => 'NewPass123!',
        ])->assertStatus(403);
    }

    public function test_normal_user_can_delete_account(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password')]);
        Sanctum::actingAs($user);

        $this->deleteJson('/api/v1/profile', ['password' => 'password'])
            ->assertStatus(200);
    }
}
