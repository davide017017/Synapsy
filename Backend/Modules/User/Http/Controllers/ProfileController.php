<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Modules\User\Http\Requests\ProfileUpdateRequest;
use ApiResponse;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // ============================
    // Edit - Show Profile Form
    // ============================
    public function edit(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'data' => $request->user(),
            ]);
        }

        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }


    // ============================
    // Update - Update Profile Info
    // ============================
    public function update(ProfileUpdateRequest $request): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $user = $request->user();

        // Prendi i dati validati senza avatar
        $data = $request->validated();

        // Rimuovi avatar da $data perché lo gestiamo a parte
        unset($data['avatar']);

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Gestione avatar upload/rimozione
        if ($request->hasFile('avatar')) {
            // Elimina avatar vecchio se esiste
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            // Salva nuovo avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        } elseif ($request->has('avatar') && $request->input('avatar') === '') {
            // Rimozione avatar
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = null;
        }

        $user->save();

        return $request->wantsJson()
            ? ApiResponse::success('Profilo aggiornato.', [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'email' => $user->email,
                'avatar_url' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ])
            : Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    // ============================
    // Destroy - Delete User Account
    // ============================
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
