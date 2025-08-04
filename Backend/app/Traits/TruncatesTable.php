<?php

namespace App\Traits;

use Illuminate\Support\Facades\Schema;

trait TruncatesTable
{
    /**
     * Svuota in sicurezza una tabella Eloquent disabilitando temporaneamente le FK.
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelClass
     */
    public function clearTable(string $modelClass): void
    {
        Schema::disableForeignKeyConstraints();
        $modelClass::truncate();
        Schema::enableForeignKeyConstraints();
    }
}

