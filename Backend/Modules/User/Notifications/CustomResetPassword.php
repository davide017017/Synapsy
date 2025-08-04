<?php

namespace Modules\User\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;

class CustomResetPassword extends BaseResetPassword implements ShouldQueue
{
    use Queueable;

    protected function resetUrl($notifiable)
    {
        $frontend = config('app.frontend_url', 'http://localhost:3000');
        return $frontend.'/reset-password?token='.$this->token.'&email='.urlencode($notifiable->getEmailForPasswordReset());
    }

    public function toMail($notifiable): MailMessage
    {
        $url = $this->resetUrl($notifiable);
        return (new MailMessage)
            ->subject(__('Reimposta la tua password'))
            ->view('user::emails.verify', [
                'url' => $url,
                'title' => __('Reimposta la tua password'),
                'buttonText' => __('Imposta Nuova Password'),
                'intro' => __('Clicca sul pulsante per scegliere una nuova password.'),
            ]);
    }
}

