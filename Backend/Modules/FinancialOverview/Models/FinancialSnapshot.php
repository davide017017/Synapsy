<?php

namespace Modules\FinancialOverview\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\User\Models\User;

/**
 * Modello per gli snapshot finanziari periodici.
 *
 * @property int $id
 * @property int $user_id
 * @property string $period_type
 * @property \Illuminate\Support\Carbon $period_start_date
 * @property \Illuminate\Support\Carbon $period_end_date
 * @property float $total_income
 * @property float $total_expense
 * @property float $balance
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 *
 * @method static \Modules\FinancialOverview\Database\Factories\FinancialSnapshotFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot query()
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot wherePeriodType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot wherePeriodStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot wherePeriodEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot whereTotalIncome($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot whereTotalExpense($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FinancialSnapshot whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class FinancialSnapshot extends Model
{
    use HasFactory;

    // ============================
    // Configurazione
    // ============================

    protected $table = 'financial_snapshots';

    protected $fillable = [
        'user_id',
        'period_type',
        'period_start_date',
        'period_end_date',
        'total_income',
        'total_expense',
        'balance',
    ];

    protected function casts(): array
    {
        return [
            'period_start_date' => 'date',
            'period_end_date' => 'date',
            'total_income' => 'float',
            'total_expense' => 'float',
            'balance' => 'float',
        ];
    }

    // ============================
    // Relazioni
    // ============================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ============================
    // Factory personalizzata
    // ============================

    protected static function newFactory(): \Modules\FinancialOverview\Database\Factories\FinancialSnapshotFactory
    {
        return \Modules\FinancialOverview\Database\Factories\FinancialSnapshotFactory::new();
    }
}
