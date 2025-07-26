<?php

namespace Modules\User\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyNewEmail extends BaseVerifyEmail implements ShouldQueue
{
    use Queueable;

    protected string $email;

    public function __construct(string $email)
    {
        $this->email = $email;
    }

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.pending-email',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($this->email),
            ]
        );
    }

    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject(__('Conferma il nuovo indirizzo email'))
            ->line(__('Per completare il cambio email clicca sul pulsante seguente.'))
            ->action(__('Conferma Nuova Email'), $verificationUrl)
            ->line(__('Questo link scadrà tra :count minuti.', [
                'count' => Config::get('auth.verification.expire', 60)
            ]));
    }
}
