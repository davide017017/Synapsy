<?php

namespace Modules\User\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Support\Facades\Config;
use Illuminate\Contracts\Queue\ShouldQueue;

class CustomVerifyEmail extends BaseVerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Personalizza il contenuto dell'email di verifica.
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject(__('Attiva Subito il Tuo Account Synapsi!'))
            ->line(__('Gentile :name,', ['name' => $notifiable->name]))
            ->line(__('Grazie per esserti registrato sulla nostra piattaforma. Per completare la creazione del tuo account e iniziare a usare Synapsi, devi verificare il tuo indirizzo email.'))
            ->line(__('Clicca sul pulsante qui sotto:'))
            ->action(__('Verifica il Mio Indirizzo Email'), $verificationUrl)
            ->line(__('Questo link di verifica è valido per i prossimi :count minuti.', [
                'count' => Config::get('auth.verification.expire', 60)
            ]))
            ->line(__('Se non hai richiesto la creazione di un account su Synapsi, ignora semplicemente questa email.'));
    }
}
