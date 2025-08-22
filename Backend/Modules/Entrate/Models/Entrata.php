<?php

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Modello Entrata
// Dettagli: rappresenta una singola entrata e include scope comuni
// ─────────────────────────────────────────────────────────────────────────────

namespace Modules\Entrate\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;

/**
 * Modello per le entrate.
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $category_id
 * @property string $description
 * @property float $amount
 * @property \Illuminate\Support\Carbon $date
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read Category|null $category
 *
 * @method static \Modules\Entrate\Database\Factories\EntrataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata query()
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Entrata whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Entrata extends Model
{
    use HasFactory;

    // ============================
    // Configurazione
    // ============================

    protected $table = 'entrate';

    protected $fillable = [
        'user_id',
        'category_id',
        'description',
        'amount',
        'date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'date' => 'date',
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

    // ===================================================================
    // Local Scopes
    // ===================================================================

    public function scopeOfUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBetweenDates(Builder $query, string $from, string $to): Builder
    {
        return $query->whereBetween('date', [$from, $to]);
    }

    // ============================
    // Factory personalizzata
    // ============================

    protected static function newFactory(): \Modules\Entrate\Database\Factories\EntrataFactory
    {
        return \Modules\Entrate\Database\Factories\EntrataFactory::new();
    }

    // ============================
    // Metodi accessori (opzionali)
    // ============================

    // Esempio:
    // public function getFormattedAmountAttribute(): string
    // {
    //     return number_format($this->amount, 2) . ' €';
    // }
}
