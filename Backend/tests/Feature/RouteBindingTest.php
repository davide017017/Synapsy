<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\User\Models\User;
use Modules\Entrate\Models\Entrata;
use Modules\Spese\Models\Spesa;
use Modules\Categories\Models\Category;
use Modules\RecurringOperations\Models\RecurringOperation;
use Symfony\Component\HttpFoundation\Response;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Route;

class RouteBindingTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware('web')->group(function () {
            Route::get('/test-binding/user/{user}', fn(User $user) => ['id' => $user->id]);
            Route::get('/test-binding/entrata/{entrata}', fn(Entrata $entrata) => ['id' => $entrata->id]);
            Route::get('/test-binding/spesa/{spesa}', fn(Spesa $spesa) => ['id' => $spesa->id]);
            Route::get('/test-binding/category/{category}', fn(Category $category) => ['id' => $category->id]);
            Route::get('/test-binding/recurring/{recurringOperation}', fn(RecurringOperation $recurringOperation) => ['id' => $recurringOperation->id]);
        });
    }

    use RefreshDatabase;

    // ================================================================
    // 👤 USER
    // ================================================================

    #[Test]
    public function it_binds_user_model_from_route(): void
    {
        $user = User::factory()->create();

        $this->get("/test-binding/user/{$user->id}")
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonFragment(['id' => $user->id]);
    }

    // ================================================================
    // 💰 ENTRATA
    // ================================================================

    #[Test]
    public function it_binds_entrata_model_from_route(): void
    {
        $user = User::factory()->create();
        $entrata = Entrata::factory()->create(['user_id' => $user->id]);

        $this->get("/test-binding/entrata/{$entrata->id}")
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonFragment(['id' => $entrata->id]);
    }

    // ================================================================
    // 🧾 SPESA
    // ================================================================

    #[Test]
    public function it_binds_spesa_model_from_route(): void
    {
        $user = User::factory()->create();
        $spesa = Spesa::factory()->create(['user_id' => $user->id]);

        $this->get("/test-binding/spesa/{$spesa->id}")
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonFragment(['id' => $spesa->id]);
    }

    // ================================================================
    // 🗂️ CATEGORY
    // ================================================================

    #[Test]
    public function it_binds_category_model_from_route(): void
    {
        $category = Category::factory()->create();

        $this->get("/test-binding/category/{$category->id}")
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonFragment(['id' => $category->id]);
    }

    // ================================================================
    // 🔁 RECURRING OPERATION
    // ================================================================

    #[Test]
    public function it_binds_recurring_operation_model_from_route(): void
    {
        $user = User::factory()->create();
        $recurring = RecurringOperation::factory()->create(['user_id' => $user->id]);

        $this->get("/test-binding/recurring/{$recurring->id}")
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonFragment(['id' => $recurring->id]);
    }
}

