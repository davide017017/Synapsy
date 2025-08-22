<?php

namespace Modules\User\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

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
            'api.verification.pending-email',
            Carbon::now()->addMinutes(config('auth.verification.expire', 60)),
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
            ->view('user::emails.verify', [
                'url' => $verificationUrl,
                'title' => __('Conferma il nuovo indirizzo email'),
                'buttonText' => __('Conferma Nuova Email'),
            ]);
    }
}
