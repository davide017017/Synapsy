<?php

namespace Modules\FinancialOverview\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class FinancialSnapshotMigrationTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================================
    // Struttura tabella
    // =========================================================================

    public function test_financial_snapshots_table_has_expected_columns_and_constraints(): void
    {
        $this->assertTrue(Schema::hasTable('financial_snapshots'));

        $this->assertTrue(Schema::hasColumns('financial_snapshots', [
            'id',
            'user_id',
            'period_type',
            'period_start_date',
            'period_end_date',
            'total_income',
            'total_expense',
            'balance',
            'created_at',
            'updated_at',
        ]));

        $this->assertTrue(
            $this->hasUniqueIndex('financial_snapshots', ['user_id', 'period_type', 'period_start_date']),
            'Vincolo unico mancante su colonne: user_id, period_type, period_start_date'
        );
    }

    // =========================================================================
    // Valori di default
    // =========================================================================

    public function test_financial_snapshots_fields_have_default_values(): void
    {
        // Crea un utente dummy per evitare violazioni FK
        $userId = DB::table('users')->insertGetId([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $id = DB::table('financial_snapshots')->insertGetId([
            'user_id' => $userId,
            'period_type' => 'monthly',
            'period_start_date' => '2025-05-01',
            'period_end_date' => '2025-05-31',
        ]);

        $snapshot = DB::table('financial_snapshots')->where('id', $id)->first();

        $this->assertEquals(0.00, $snapshot->total_income);
        $this->assertEquals(0.00, $snapshot->total_expense);
        $this->assertEquals(0.00, $snapshot->balance);
    }

    // =========================================================================
    // Constraint enum
    // =========================================================================

    public function test_financial_snapshots_rejects_invalid_period_type(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        // Crea un utente dummy per evitare violazioni FK
        $userId = DB::table('users')->insertGetId([
            'name' => 'Test User',
            'email' => 'invalid@example.com',
            'password' => bcrypt('password'),
        ]);

        DB::table('financial_snapshots')->insert([
            'user_id' => $userId,
            'period_type' => 'invalid', // valore non ammesso
            'period_start_date' => '2025-05-01',
            'period_end_date' => '2025-05-31',
        ]);
    }

    // =========================================================================
    // Helper vincoli
    // =========================================================================

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

