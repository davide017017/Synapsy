<?php

namespace Modules\RecurringOperations\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RecurringOperationsMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_recurring_operations_table_has_expected_columns_and_constraints(): void
    {
        // Verifica che la tabella esista
        $this->assertTrue(Schema::hasTable('recurring_operations'));

        // Verifica le colonne principali
        $this->assertTrue(Schema::hasColumns('recurring_operations', [
            'id',
            'user_id',
            'category_id',
            'description',
            'amount',
            'type',
            'start_date',
            'end_date',
            'frequency',
            'interval',
            'next_occurrence_date',
            'is_active',
            'notes',
            'created_at',
            'updated_at',
        ]));

        // Se in futuro aggiungi vincoli unici, potrai verificare così:
        // $this->assertTrue(
        //     $this->hasUniqueIndex('recurring_operations', ['user_id', 'description']),
        //     'Vincolo unico mancante su colonne: user_id, description'
        // );
    }

    // Helper per verificare vincoli unici
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
