<?php

namespace Modules\Spese\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class SpesaMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_spese_table_has_expected_columns_and_constraints(): void
    {
        $this->assertTrue(Schema::hasTable('spese'));

        $this->assertTrue(Schema::hasColumns('spese', [
            'id',
            'user_id',
            'category_id',
            'date',
            'description',
            'amount',
            'notes',
            'created_at',
            'updated_at',
        ]));

        $this->assertTrue(
            $this->hasUniqueIndex('spese', ['user_id', 'date', 'description']),
            'Vincolo unico mancante su colonne: user_id, date, description'
        );
    }

    // Helper per vincoli unici (Schema::getIndexes è indipendente dal driver)
    protected function hasUniqueIndex(string $table, array $columns): bool
    {
        foreach (Schema::getIndexes($table) as $index) {
            if ($index['unique'] && $index['columns'] === $columns) {
                return true;
            }
        }

        return false;
    }
}
