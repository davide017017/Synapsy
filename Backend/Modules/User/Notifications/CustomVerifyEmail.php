<?php

namespace Modules\User\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends BaseVerifyEmail implements ShouldQueue
{
    use Queueable;

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'api.verification.verify',
            Carbon::now()->addMinutes(config('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    // Email di verifica account
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject(__('Verifica il tuo account Synapsy'))
            ->view('user::emails.verify', [
                'url'        => $verificationUrl,
                'title'      => __('Conferma accesso al Neural Core'),
                'buttonText' => __('Verifica email'),
                'intro'      => __('Ciao :name, manca solo un piccolo commit: verifica la tua email per attivare l\'account.', ['name' => $notifiable->name]),
            ]);
    }
}
