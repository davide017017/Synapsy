<?php

namespace Modules\User\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Spese\Models\Spesa;
use Modules\Entrate\Models\Entrata;
use Modules\Categories\Models\Category;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\User\Notifications\CustomVerifyEmail;
use Modules\User\Database\Factories\UserFactory;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

/**
 * @property int $id
 * @property string $name
 * @property string $surname
 * @property string $username
 * @property string $email
 * @property string|null $avatar
 * @property string|null $theme      // es: dark, light, solarized, emerald, etc.
 * @property string|null $password
 * @property bool $is_admin
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * // Opzionali:
 * @property string|null $birthdate
 * @property string|null $phone
 * @property string|null $locale
 */
class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    // ===================================================================
    // JWT Auth
    // ===================================================================
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // ===================================================================
    // Fillable
    // ===================================================================
    protected $fillable = [
        'name',
        'surname',
        'username',         // NEW: username univoco
        'email',
        'password',
        'avatar',           // NEW: url o path avatar
        'theme',            // NEW: tema preferito utente
        // 'birthdate',     // Opzionale: data di nascita
        // 'phone',         // Opzionale: telefono
        // 'locale',        // Opzionale: lingua preferita
        'is_admin',
    ];

    // ===================================================================
    // Hidden
    // ===================================================================
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ===================================================================
    // Casts
    // ===================================================================
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'avatar' => 'string',
            'theme' => 'string',
            'birthdate' => 'date:Y-m-d', // se usi la colonna
        ];
    }

    // ===================================================================
    // Notifiche email custom
    // ===================================================================
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomVerifyEmail());
    }

    // ===================================================================
    // RELAZIONI
    // ===================================================================
    public function spese(): HasMany
    {
        return $this->hasMany(Spesa::class);
    }

    public function entrate(): HasMany
    {
        return $this->hasMany(Entrata::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function recurringOperations(): HasMany
    {
        return $this->hasMany(RecurringOperation::class);
    }

    // ===================================================================
    // Helpers
    // ===================================================================
    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    // ===================================================================
    // Factory
    // ===================================================================
    public static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }
}
