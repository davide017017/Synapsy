<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Modules\User\Models\User;
use Tests\TestCase;

class DemoUserProtectionTest extends TestCase
{
    use RefreshDatabase;

    protected function createDemoUser(): User
    {
        return User::factory()->create([
            'email' => 'demo@synapsy.app',
            'password' => Hash::make('password1234'),
            'email_verified_at' => now(),
        ]);
    }

    public function test_demo_user_cannot_update_profile(): void
    {
        $user = $this->createDemoUser();
        Sanctum::actingAs($user, ['*']);

        $response = $this->putJson('/api/v1/profile', ['name' => 'New Name']);

        $response->assertStatus(403);
    }

    public function test_demo_user_cannot_delete_profile(): void
    {
        $user = $this->createDemoUser();
        Sanctum::actingAs($user, ['*']);

        $response = $this->deleteJson('/api/v1/profile', ['password' => 'password1234']);

        $response->assertStatus(403);
    }

    public function test_demo_user_cannot_change_password(): void
    {
        $user = $this->createDemoUser();
        $this->actingAs($user);

        $response = $this->put('/password', [
            'current_password' => 'password1234',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(403);
    }
}
