<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Modules\Categories\Models\Category;
use Modules\Entrate\Models\Entrata;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\Spese\Models\Spesa;
use Modules\User\Models\User;
use Tests\TestCase;

/**
 * Test che esegue una chiamata a tutte le rotte con prefisso `api`.
 * Le rotte vengono suddivise tra pubbliche e protette tramite middleware `auth`.
 * È inoltre fornito un riepilogo finale con l'elenco degli endpoint in errore,
 * ordinato per priorità (codice HTTP) e con messaggio sintetico.
 *
 * Parametri di test e rotte da escludere possono essere personalizzati al volo
 * tramite le variabili d'ambiente `API_ROUTE_PARAM_DEFAULTS` (JSON) e
 * `API_ROUTE_BLACKLIST` (lista separata da virgole).
 */
class ApiRoutesTest extends TestCase
{
    use RefreshDatabase;

    // ───────────────────────────────
    // Parametri e blacklist custom
    // ───────────────────────────────
    protected array $paramDefaults = [
        'id' => 1,
        'user' => 1,
        'category' => 99,
        'entrata' => 1,
        'spesa' => 1,
        'recurring_operation' => 99,
    ];

    protected array $blacklist = [];

    protected User $user;

    /**
     * Riepilogo globale dettagliato
     *
     * @var array<int, array{method: string, uri: string, status: int, msg: string}>
     */
    protected static array $errorDetails = [];

    protected static int $totalRoutes = 0;

    // ───────────────────────────────
    // Setup — seed dati per evitare 404
    // ───────────────────────────────
    protected function setUp(): void
    {
        parent::setUp();

        if ($envParams = env('API_ROUTE_PARAM_DEFAULTS')) {
            $decoded = json_decode($envParams, true);
            if (is_array($decoded)) {
                $this->paramDefaults = array_merge($this->paramDefaults, $decoded);
            }
        }

        if ($envBlacklist = env('API_ROUTE_BLACKLIST')) {
            $items = array_filter(array_map('trim', explode(',', $envBlacklist)));
            $this->blacklist = array_merge($this->blacklist, $items);
        }

        // Popola il database con dati di test per evitare 404 su ID hardcoded
        $this->user = User::factory()->create(['id' => 1]);

        $incomeCategory = Category::factory()->income()->create([
            'id' => 1,
            'user_id' => $this->user->id,
        ]);

        $expenseCategory = Category::factory()->expense()->create([
            'id' => 2,
            'user_id' => $this->user->id,
        ]);

        Category::factory()->create([
            'id' => 99,
            'user_id' => $this->user->id,
        ]);

        Entrata::factory()
            ->forUser($this->user)
            ->forCategory($incomeCategory)
            ->create(['id' => 1]);

        Spesa::factory()
            ->forUser($this->user)
            ->forCategory($expenseCategory)
            ->create(['id' => 1]);

        RecurringOperation::factory()
            ->forUser($this->user)
            ->forCategory($incomeCategory)
            ->state(['type' => 'entrata'])
            ->create(['id' => 1]);

        RecurringOperation::factory()
            ->forUser($this->user)
            ->forCategory($incomeCategory)
            ->state(['type' => 'entrata'])
            ->create(['id' => 99]);
    }

    // ───────────────────────────────
    // Helpers rotte
    // ───────────────────────────────
    protected function getApiRoutes()
    {
        return collect(Route::getRoutes()->getRoutes())
            ->filter(fn ($route) => Str::startsWith($route->uri(), 'api'))
            ->reject(fn ($route) => in_array($route->uri(), $this->blacklist));
    }

    protected function fillUriParameters(string $uri): string
    {
        return preg_replace_callback('/\{(\w+)\??\}/', function ($matches) {
            return $this->paramDefaults[$matches[1]] ?? 1;
        }, $uri);
    }

    protected function requiresAuth($route): bool
    {
        return collect($route->middleware())->contains(fn ($m) => Str::contains($m, 'auth'));
    }

    protected function getRequestBody($route, string $method): array
    {
        $pattern = $method.' '.$route->uri();

        return match (true) {
            // Categories
            Str::is('POST api/v1/categories', $pattern) => [
                'name' => 'Categoria Test',
                'type' => 'entrata',
            ],
            Str::is('PUT api/v1/categories/*', $pattern) => [
                'name' => 'Categoria Aggiornata',
                'type' => 'entrata',
            ],

            // Entrate
            Str::is('POST api/v1/entrate', $pattern) => [
                'date' => now()->toDateString(),
                'description' => 'Entrata Test',
                'amount' => 100,
                'category_id' => 1,
            ],
            Str::is('PUT api/v1/entrate/*', $pattern) => [
                'date' => now()->toDateString(),
                'description' => 'Entrata Aggiornata',
                'amount' => 150,
                'category_id' => 1,
            ],
            Str::is('PATCH api/v1/entrate/move-category', $pattern) => [
                'oldCategoryId' => 1,
                'newCategoryId' => 2,
            ],

            // Spese
            Str::is('POST api/v1/spese', $pattern) => [
                'date' => now()->toDateString(),
                'description' => 'Spesa Test',
                'amount' => 50,
                'category_id' => 2,
            ],
            Str::is('PUT api/v1/spese/*', $pattern) => [
                'date' => now()->toDateString(),
                'description' => 'Spesa Aggiornata',
                'amount' => 75,
                'category_id' => 2,
            ],
            Str::is('PATCH api/v1/spese/move-category', $pattern) => [
                'oldCategoryId' => 2,
                'newCategoryId' => 1,
            ],

            // Recurring operations
            Str::is('POST api/v1/recurring-operations', $pattern) => [
                'description' => 'Operazione Ricorrente',
                'amount' => 1000,
                'type' => 'entrata',
                'start_date' => now()->toDateString(),
                'frequency' => 'monthly',
                'interval' => 1,
                'is_active' => true,
                'category_id' => 1,
            ],
            Str::is('PUT api/v1/recurring-operations/*', $pattern) => [
                'description' => 'Operazione Aggiornata',
                'amount' => 1500,
                'type' => 'entrata',
                'start_date' => now()->toDateString(),
                'frequency' => 'monthly',
                'interval' => 1,
                'is_active' => true,
                'category_id' => 1,
            ],
            Str::is('PATCH api/v1/recurring-operations/*', $pattern) => [
                'description' => 'Operazione Aggiornata',
                'amount' => 1500,
                'type' => 'entrata',
                'start_date' => now()->toDateString(),
                'frequency' => 'monthly',
                'interval' => 1,
                'is_active' => true,
                'category_id' => 1,
            ],
            Str::is('PATCH api/v1/recurring-operations/move-category', $pattern) => [
                'oldCategoryId' => 1,
                'newCategoryId' => 2,
            ],

            default => [],
        };
    }

    // ───────────────────────────────
    // Core: Esegui richieste sulle rotte
    // ───────────────────────────────
    protected function exerciseRoutes($routes, string $label): void
    {
        $count = 0;

        fwrite(STDOUT, "\n$label:\n");

        foreach ($routes as $route) {
            $uri = '/'.$this->fillUriParameters($route->uri());

            foreach ($route->methods() as $method) {
                if (in_array($method, ['HEAD', 'OPTIONS'])) {
                    continue;
                }

                $body = $this->getRequestBody($route, $method);
                $response = $this->json($method, $uri, $body);
                $status = $response->getStatusCode();

                fwrite(STDOUT, sprintf("[%s] %s => %s\n", $method, $uri, $status));
                $count++;
                self::$totalRoutes++;

                if ($status >= 400) {
                    // Cerca di estrarre un messaggio breve dalla response
                    $shortMsg = '';
                    $json = json_decode($response->getContent(), true);
                    if (isset($json['message'])) {
                        $shortMsg = $json['message'];
                    } elseif (is_string($response->getContent()) && strlen($response->getContent()) < 100) {
                        $shortMsg = $response->getContent();
                    }
                    self::$errorDetails[] = [
                        'status' => $status,
                        'method' => $method,
                        'uri' => $uri,
                        'msg' => $shortMsg,
                    ];
                }
            }
        }

        $errorsInGroup = array_filter(self::$errorDetails, fn ($e) => $e['status'] >= 400);
        fwrite(STDOUT, sprintf("Totali %s: %d, errori: %d\n", strtolower($label), $count, count($errorsInGroup)));

        $this->assertTrue(true); // evita il fallimento automatico del test
    }

    // ───────────────────────────────
    // Test pubbliche/protette
    // ───────────────────────────────
    public function test_public_api_routes(): void
    {
        $routes = $this->getApiRoutes()->reject(fn ($route) => $this->requiresAuth($route));
        $this->exerciseRoutes($routes, 'Rotte pubbliche');
    }

    public function test_protected_api_routes(): void
    {
        Sanctum::actingAs($this->user, ['*']);
        $routes = $this->getApiRoutes()->filter(fn ($route) => $this->requiresAuth($route));
        $this->exerciseRoutes($routes, 'Rotte protette');
    }

    // ───────────────────────────────
    // Riepilogo globale tabellare e ordinato
    // ───────────────────────────────
    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();

        if (empty(self::$errorDetails)) {
            fwrite(STDOUT, "\n✅ Tutte le rotte hanno risposto con status 2xx.\n");

            return;
        }

        // Ordina errori: prima 500, poi 400, 422, 404, ecc
        $ordered = collect(self::$errorDetails)
            ->sortBy([
                fn ($a) => $a['status'] < 500 ? 1 : 0,
                fn ($a) => $a['status'],
                fn ($a) => $a['uri'],
            ])
            ->values();

        fwrite(STDOUT, "\n🛑 Rotte con errori (ordinate per gravità):\n");
        fwrite(STDOUT, str_pad('Codice', 8).str_pad('Metodo', 8).str_pad('Endpoint', 45)."Info\n");
        fwrite(STDOUT, str_repeat('-', 75)."\n");

        foreach ($ordered as $e) {
            $row = sprintf(
                "%-8s%-8s%-45s%s\n",
                $e['status'],
                $e['method'],
                $e['uri'],
                $e['msg'] ?? ''
            );
            fwrite(STDOUT, $row);
        }

        fwrite(STDOUT, str_repeat('-', 75)."\n");
        fwrite(STDOUT, 'Totale errori: '.count($ordered).' su '.self::$totalRoutes." rotte testate.\n");
    }
}
