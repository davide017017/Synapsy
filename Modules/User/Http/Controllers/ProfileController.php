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

class ProfileController extends Controller
{
    // ============================
    // Edit - Show Profile Form
    // ============================
    public function edit(Request $request): View
    {
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
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return $request->wantsJson()
            ? ApiResponse::success('Profilo aggiornato.', $user)
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
