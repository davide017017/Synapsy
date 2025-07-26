<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ApiResponse;
use Modules\User\Models\User;
use Illuminate\Support\Facades\URL;

class VerifyPendingEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->pending_email ?: ''), $hash) || ! URL::hasValidSignature($request)) {
            return ApiResponse::error('Link non valido o scaduto', null, 403);
        }

        $user->email = $user->pending_email;
        $user->pending_email = null;
        $user->email_verified_at = now();
        $user->save();

        $token = $user->createToken('api-token')->plainTextToken;
        $frontend = config('app.frontend_url', 'http://localhost:3000');
        return redirect()->to($frontend.'/login?verified=1&token='.$token);
    }
}
