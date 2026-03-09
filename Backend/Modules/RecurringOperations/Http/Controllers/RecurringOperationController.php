<?php

namespace Modules\RecurringOperations\Http\Controllers;

use ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\RecurringOperations\Http\Requests\StoreRecurringOperationRequest;
use Modules\RecurringOperations\Http\Requests\UpdateRecurringOperationRequest;
use Modules\RecurringOperations\Jobs\ProcessRecurringOperation;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\RecurringOperations\Services\RecurringOperationService;

class RecurringOperationController extends Controller
{
    public function __construct(protected RecurringOperationService $service)
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(RecurringOperation::class, 'recurring_operation');
    }

    // ============================
    // Index — con paginazione opzionale (backward compat)
    // ============================
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_date'                 => 'date|nullable',
            'end_date'                   => 'date|nullable',
            'next_occurrence_start_date' => 'date|nullable',
            'next_occurrence_end_date'   => 'date|nullable',
            'description'                => 'string|nullable',
            'category_id'                => 'integer|nullable',
            'type'                       => 'in:entrata,spesa|nullable',
            'is_active'                  => 'nullable',
            'sort_by'                    => 'string|nullable',
            'sort_direction'             => 'in:asc,desc|nullable',
            'page'                       => 'integer|min:1|nullable',
            'per_page'                   => 'integer|min:1|max:100|nullable',
        ]);

        $user = $request->user();

        $filters = [
            'start_date'                 => $validated['start_date'] ?? null,
            'end_date'                   => $validated['end_date'] ?? null,
            'next_occurrence_start_date' => $validated['next_occurrence_start_date'] ?? null,
            'next_occurrence_end_date'   => $validated['next_occurrence_end_date'] ?? null,
            'description'                => $validated['description'] ?? null,
            'category_id'                => $validated['category_id'] ?? null,
            'type'                       => $validated['type'] ?? null,
            'is_active'                  => $validated['is_active'] ?? null,
        ];

        $sortBy        = $validated['sort_by'] ?? 'next_occurrence_date';
        $sortDirection = $validated['sort_direction'] ?? 'asc';

        // ── backward compat: senza page/per_page → risposta flat legacy ──────
        $legacy = ! $request->hasAny(['page', 'per_page']) || $request->boolean('legacy', false);

        if ($legacy) {
            $items = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);

            return ApiResponse::success('Operazioni ricorrenti caricate.', [
                'items'   => $items,
                'sort'    => ['by' => $sortBy, 'direction' => $sortDirection],
                'filters' => $filters,
            ]);
        }

        $page      = (int) ($validated['page'] ?? 1);
        $perPage   = (int) ($validated['per_page'] ?? 50);
        $paginated = $this->service->getFilteredAndSortedForUserPaginated(
            $user, $filters, $sortBy, $sortDirection, $page, $perPage
        );

        return ApiResponse::success('Operazioni ricorrenti caricate.', [
            'items'      => $paginated->items(),
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
                'has_more'     => $paginated->hasMorePages(),
            ],
            'sort'    => ['by' => $sortBy, 'direction' => $sortDirection],
            'filters' => $filters,
        ]);
    }

    // ============================
    // Store
    // ============================
    public function store(StoreRecurringOperationRequest $request): JsonResponse
    {
        $operation = $this->service->createOperation($request->validated(), $request->user());

        if ($request->boolean('generate_past_now')) {
            ProcessRecurringOperation::dispatch($operation);
        }

        return ApiResponse::success('Operazione ricorrente creata.', $operation, 201);
    }

    // ============================
    // Show
    // ============================
    public function show(Request $request, RecurringOperation $recurringOperation): JsonResponse
    {
        $recurringOperation->load('category');

        return ApiResponse::success('Operazione trovata.', $recurringOperation);
    }

    // ============================
    // Update
    // ============================
    public function update(UpdateRecurringOperationRequest $request, RecurringOperation $recurringOperation): JsonResponse
    {
        $this->service->updateOperation($recurringOperation, $request->validated());

        return ApiResponse::success('Operazione aggiornata.', $recurringOperation);
    }

    // ============================
    // Destroy
    // ============================
    public function destroy(Request $request, RecurringOperation $recurringOperation): JsonResponse
    {
        $this->service->deleteOperation($recurringOperation);

        return response()->json(null, 204);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Utility: moveCategory
    // ────────────────────────────────────────────────────────────────────────
    public function moveCategory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids'         => ['sometimes', 'array', 'min:1'],
            'ids.*'       => ['integer', 'min:1'],
            'category_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $q = RecurringOperation::query()->where('user_id', $request->user()->id);

        if (! empty($data['ids'])) {
            $q->whereIn('id', $data['ids']);
        }

        $updated = $q->update(['category_id' => $data['category_id'] ?? null]);

        return ApiResponse::success('Categoria aggiornata.', ['updated' => $updated]);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Utility: getNextOccurrences
    // ────────────────────────────────────────────────────────────────────────
    public function getNextOccurrences(Request $request): JsonResponse
    {
        $user = $request->user();
        $days = max(1, (int) $request->query('days', 30));

        $from = now()->startOfDay();
        $to   = now()->addDays($days)->endOfDay();

        $operations = RecurringOperation::query()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->whereNotNull('next_occurrence_date')
            ->whereBetween('next_occurrence_date', [$from, $to])
            ->orderBy('next_occurrence_date')
            ->get(['id', 'description', 'amount', 'type', 'next_occurrence_date', 'category_id']);

        return ApiResponse::success('Prossime occorrenze.', [
            'from'  => $from->toDateString(),
            'to'    => $to->toDateString(),
            'items' => $operations,
        ]);
    }
}
