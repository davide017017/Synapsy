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
    // Show - Current Profile
    // ============================
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $avatarUrl = null;
        $avatarPath = $user->avatar;
        if ($avatarPath && Storage::disk('public')->exists($avatarPath)) {
            $avatarUrl = asset('storage/' . $avatarPath);
        }

        return ApiResponse::success('Profilo corrente.', [
            'id' => $user->id,
            'name'        => $user->name,
            'surname'     => $user->surname,
            'username'    => $user->username,
            'email'       => $user->email,
            'theme'       => $user->theme,
            'avatar'      => $avatarPath,
            'avatar_url'  => $avatarUrl,
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

        // Gestione avatar upload/rimozione/impostazione path
        if ($request->hasFile('avatar')) {
            // Elimina avatar vecchio se esiste
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            // Salva nuovo avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        } elseif ($request->filled('avatar')) {
            // Imposta avatar da path stringa
            if ($user->avatar && $request->input('avatar') !== $user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $request->input('avatar');
        } elseif ($request->has('avatar') && $request->input('avatar') === '') {
            // Rimozione avatar
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = null;
        }

        $user->save();

        $avatarUrl = null;
        $avatarPath = $user->avatar;
        if ($avatarPath && Storage::disk('public')->exists($avatarPath)) {
            $avatarUrl = asset('storage/' . $avatarPath);
        }

        return $request->wantsJson()
            ? ApiResponse::success('Profilo aggiornato.', [
                'id'         => $user->id,
                'name'       => $user->name,
                'surname'    => $user->surname,
                'username'   => $user->username,
                'email'      => $user->email,
                'theme'      => $user->theme,
                'avatar'     => $avatarPath,
                'avatar_url' => $avatarUrl,
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
