<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Modules\User\Models\User;

// ─────────────────────────────────────────────────────────────────────────────
// Controller: UserController
// Dettagli: CRUD utenti via API JSON
// ─────────────────────────────────────────────────────────────────────────────
class UserController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: index
    // Dettagli: lista utenti paginata
    // ─────────────────────────────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $users = User::select('id', 'name', 'surname', 'email', 'is_admin')
            ->paginate($request->query('per_page', 30));

        return response()->json($users);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: show
    // Dettagli: dettaglio utente
    // ─────────────────────────────────────────────────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $user = User::select('id', 'name', 'surname', 'email', 'is_admin')
            ->findOrFail($id);

        return response()->json($user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: store
    // Dettagli: crea un nuovo utente
    // ─────────────────────────────────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'is_admin' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: update
    // Dettagli: aggiorna un utente esistente
    // ─────────────────────────────────────────────────────────────────────────────
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'surname' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8',
            'is_admin' => 'sometimes|boolean',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: destroy
    // Dettagli: elimina un utente
    // ─────────────────────────────────────────────────────────────────────────────
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
}
