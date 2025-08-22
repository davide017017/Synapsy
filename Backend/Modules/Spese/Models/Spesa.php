<?php

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Modello Spesa
// Dettagli: rappresenta una spesa utente con scope comuni
// ─────────────────────────────────────────────────────────────────────────────

namespace Modules\Spese\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $category_id
 * @property string $description
 * @property float $amount
 * @property \Illuminate\Support\Carbon $date
 * @property string|null $notes
 * @property-read User $user
 * @property-read Category|null $category
 */
class Spesa extends Model
{
    use HasFactory;

    protected $table = 'spese';

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
            'amount' => 'decimal:2',
            'date' => 'date',
        ];
    }

    // ===================================================================
    // Relazioni
    // ===================================================================

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

    // ===================================================================
    // Factory
    // ===================================================================

    protected static function newFactory(): \Modules\Spese\Database\Factories\SpesaFactory
    {
        return \Modules\Spese\Database\Factories\SpesaFactory::new();
    }
}
