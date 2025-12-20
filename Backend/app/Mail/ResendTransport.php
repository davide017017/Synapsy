<?php

namespace App\Mail;

use Resend;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Email;

class ResendTransport extends AbstractTransport
{
  public function __construct(
    private readonly string $apiKey,
    private readonly string $defaultFrom,
  ) {
    parent::__construct();
  }

  protected function doSend(SentMessage $message): void
  {
    $email = $message->getOriginalMessage();
    if (!$email instanceof Email) return;

    $from = $email->getFrom()[0]->toString() ?? $this->defaultFrom;

    $client = Resend::client($this->apiKey);

    $client->emails->send([
      'from'    => $from,
      'to'      => array_map(fn($a) => $a->toString(), $email->getTo()),
      'subject' => (string) $email->getSubject(),
      'html'    => $email->getHtmlBody() ?: nl2br((string) $email->getTextBody()),
    ]);
  }

  public function __toString(): string
  {
    return 'resend';
  }
}
