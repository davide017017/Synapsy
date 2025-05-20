<?php

namespace App\Traits;

use Symfony\Component\Console\Output\ConsoleOutput;

trait LogsSeederOutput
{
    protected ConsoleOutput $out;

    protected function initOutput(): void
    {
        $this->out = new ConsoleOutput();
    }

    protected function logInfo(string $context, string $message, string $emoji = 'ℹ️'): void
    {
        $this->out->writeln("{$emoji} <info>[{$context}]</info> {$message}");
    }

    protected function logWarning(string $context, string $message, string $emoji = '⚠️'): void
    {
        $this->out->writeln("{$emoji} <comment>[{$context}]</comment> {$message}");
    }

    protected function logSuccess(string $context, string $message, string $emoji = '✅'): void
    {
        $this->out->writeln("{$emoji} <info>[{$context}]</info> {$message}");
    }

    protected function logSkip(string $context, string $message, string $emoji = '⏭️'): void
    {
        $this->out->writeln("{$emoji} <comment>[{$context}]</comment> {$message}");
    }

    protected function logNewLine(): void
    {
        $this->out->writeln('');
    }
}
