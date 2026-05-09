<?php

namespace Modules\User\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends BaseResetPassword
{
    protected function resetUrl($notifiable)
    {
        $frontend = config('app.frontend_url', 'http://localhost:3000');

        return $frontend.'/reset-password?token='.$this->token.'&email='.urlencode($notifiable->getEmailForPasswordReset());
    }

    public function toMail($notifiable): MailMessage
    {
        $url = $this->resetUrl($notifiable);

        return (new MailMessage)
            ->subject(__('Reset password Synapsy'))
            ->view('user::emails.verify', [
                'url'        => $url,
                'title'      => __('Reset credenziali richiesto'),
                'buttonText' => __('Reimposta password'),
                'intro'      => __('Abbiamo ricevuto una richiesta per reimpostare la password. Se sei stato tu, procedi da qui.'),
            ]);
    }
}
