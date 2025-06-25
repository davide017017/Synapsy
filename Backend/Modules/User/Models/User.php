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
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property bool $is_admin
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    // 🔑 JWT: id nel subject del token
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // 🔐 Nessun custom claim extra (puoi aggiungerne se serve)
    public function getJWTCustomClaims()
    {
        return [];
    }

    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'is_admin',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'avatar' => 'string',
        ];
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomVerifyEmail());
    }

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

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    public static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }
}
