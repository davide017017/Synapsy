<?php

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Modello Category
// Dettagli: categorie per transazioni, con scope di utilità
// ─────────────────────────────────────────────────────────────────────────────

namespace Modules\Categories\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Categories\Database\Factories\CategoryFactory;
use Modules\User\Models\User;

/**
 * Modello per le categorie (entrate/spese).
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 *
 * @method static CategoryFactory factory($count = null, array $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Category extends Model
{
    use HasFactory;

    // ============================
    // Configurazione
    // ============================

    protected $table = 'categories';

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'color',
        'icon',
    ];

    protected $casts = [
        'type' => 'string',
    ];

    // ============================
    // Relazioni
    // ============================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ===================================================================
    // Local Scopes
    // ===================================================================

    public function scopeOfUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    // ============================
    // Metodi accessori
    // ============================

    public function isIncome(): bool
    {
        return $this->type === 'entrata';
    }

    public function isExpense(): bool
    {
        return $this->type === 'spesa';
    }

    // ============================
    // Factory personalizzata
    // ============================

    protected static function newFactory(): CategoryFactory
    {
        return CategoryFactory::new();
    }
}
