<?php

namespace Modules\User\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

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

    /**
     * Personalizza il contenuto dell'email di verifica.
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject(__('Attiva Subito il Tuo Account Synapsi!'))
            ->view('user::emails.verify', [
                'url' => $verificationUrl,
                'title' => __('Attiva Subito il Tuo Account Synapsi!'),
                'buttonText' => __('Verifica il Mio Indirizzo Email'),
                'intro' => __('Gentile :name, per completare la registrazione clicca sul pulsante seguente.', ['name' => $notifiable->name]),
            ]);
    }
}
