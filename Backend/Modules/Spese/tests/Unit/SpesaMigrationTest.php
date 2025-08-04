<?php

namespace Modules\Spese\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
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

    // Helper per vincoli unici
    protected function hasUniqueIndex(string $table, array $columns): bool
    {
        $indexRows = DB::select("SHOW INDEXES FROM {$table}");
        $groupedIndexes = [];

        foreach ($indexRows as $row) {
            $groupedIndexes[$row->Key_name]['unique'] = !$row->Non_unique;
            $groupedIndexes[$row->Key_name]['columns'][] = $row->Column_name;
        }

        foreach ($groupedIndexes as $index) {
            if ($index['unique'] && $index['columns'] === $columns) {
                return true;
            }
        }

        return false;
    }
}

