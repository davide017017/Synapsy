<?php

namespace Modules\User\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Modules\User\Models\User;

class ApiVerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash) || ! URL::hasValidSignature($request)) {
            return ApiResponse::error('Link non valido o scaduto', null, 403);
        }
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
        $token = $user->createToken('api-token')->plainTextToken;
        $frontend = config('app.frontend_url', 'http://localhost:3000');
        return redirect()->to($frontend.'/login?verified=1&token='.$token);
    }
}
