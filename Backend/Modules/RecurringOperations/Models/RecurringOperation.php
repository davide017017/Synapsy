<?php

namespace Modules\RecurringOperations\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;

/**
 * Modello per le operazioni ricorrenti (entrata o spesa).
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $category_id
 * @property string $description
 * @property float $amount
 * @property string $type
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string $frequency
 * @property int $interval
 * @property \Illuminate\Support\Carbon $next_occurrence_date
 * @property bool $is_active
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read Category|null $category
 *
 * @method static \Modules\RecurringOperations\Database\Factories\RecurringOperationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation query()
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereNextOccurrenceDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecurringOperation whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class RecurringOperation extends Model
{
    use HasFactory;

    // ============================
    // Configurazione
    // ============================

    protected $table = 'recurring_operations';

    protected $fillable = [
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
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'next_occurrence_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // ============================
    // Relazioni
    // ============================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // ============================
    // Factory personalizzata
    // ============================

    protected static function newFactory(): \Modules\RecurringOperations\Database\Factories\RecurringOperationFactory
    {
        return \Modules\RecurringOperations\Database\Factories\RecurringOperationFactory::new();
    }

    // ============================
    // Metodi accessori (opzionali)
    // ============================

    public function isIncome(): bool
    {
        return $this->type === 'entrata';
    }

    public function isExpense(): bool
    {
        return $this->type === 'spesa';
    }
}
