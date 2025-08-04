<?php

namespace Modules\Spese\Models; // Namespace specifico del modulo Spese

use Illuminate\Database\Eloquent\Model; // Classe base per i modelli Eloquent
use Illuminate\Database\Eloquent\Factories\HasFactory; // Trait per le Factory
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Classe per relazioni BelongsTo
use Modules\User\Models\User;
use Modules\Categories\Models\Category; // Importa il modello Category dal suo modulo

// Il modello Spesa rappresenta una singola spesa finanziaria nel database.
// Ogni spesa appartiene a un utente e può essere associata a una categoria.
/**
 * 
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
 * @property-read Category|null $category
 * @property-read User $user
 * @method static \Modules\Spese\Database\Factories\SpesaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Spesa whereUserId($value)
 * @mixin \Eloquent
 */
class Spesa extends Model
{
    // Utilizza il trait HasFactory per associare questo modello alla sua Factory.
    use HasFactory;

    /**
     * Il nome della tabella associata al modello.
     * Eloquent dedurrà  il nome 'spese' automaticamente, ma definirlo esplicitamente
     * può essere utile per chiarezza o se il nome della tabella non segue la convenzione.
     *
     * @var string
     */
    protected $table = 'spese';

    /**
     * Attributi che possono essere assegnati in massa (mass assignable).
     * Definisce quali colonne possono essere riempite usando metodi come create() o fill().
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',     // La chiave esterna all'utente
        'category_id', // La chiave esterna alla categoria (può essere null)
        'description', // Descrizione della spesa
        'amount',      // Importo della spesa
        'date',        // Data della spesa
        'notes',       // Note aggiuntive (opzionale)
        // 'created_at', // I timestamps sono gestiti automaticamente da Eloquent
        // 'updated_at', // I timestamps sono gestiti automaticamente da Eloquent
    ];

    /**
     * Casting degli attributi a tipi specifici.
     * Assicura che 'amount' sia trattato come float e 'date' come oggetto Carbon.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'float', // Converte l'importo in float
            'date' => 'date',    // Converte la data in un oggetto Carbon (solo data, senza ora)
            // Se nella migrazione hai usato datetime per la data, usa 'datetime' qui.
            // 'created_at' => 'datetime', // Esempi di casting per i timestamps (gestiti automaticamente)
            // 'updated_at' => 'datetime',
        ];
    }


    // =========================================================================
    // SEZIONE: RELAZIONI
    // Definisce le relazioni del modello Spesa con altri modelli.
    // =========================================================================

    /**
     * Ottiene l'utente proprietario della spesa.
     * Definisce una relazione Many-to-One (Molte spese appartengono a un utente).
     * Laravel cercherà  una colonna 'user_id' nella tabella 'spese'.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        // Ritorna la relazione BelongsTo con il modello User.
        // Laravel assumerà  che la chiave esterna sia 'user_id' e la chiave locale sia 'id' sul modello User.
        return $this->belongsTo(User::class);
    }

    /**
     * Ottiene la categoria associata alla spesa.
     * Definisce una relazione Many-to-One (Molte spese possono avere la stessa categoria).
     * Laravel cercherà una colonna 'category_id' nella tabella 'spese'.
     * Questa relazione può essere null se category_id nella migrazione è nullable.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        // Ritorna la relazione BelongsTo con il modello Category.
        // Laravel assumerà  che la chiave esterna sia 'category_id' e la chiave locale sia 'id' sul modello Category.
        return $this->belongsTo(Category::class);
    }

    // =========================================================================
    // SEZIONE: FACTORY
    // Sovrascrive il metodo di default per specificare la Factory del modulo.
    // =========================================================================

    /**
     * Crea una nuova istanza della factory associata al modello.
     * Questo metodo sovrascrive il metodo di default fornito da HasFactory
     * per specificare esplicitamente la Factory del modulo.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
    {
        // Assicurati che il namespace della tua SpesaFactory sia corretto.
        // Dovrai creare questa Factory in Modules/Spese/Database/Factories/SpesaFactory.php
        return \Modules\Spese\Database\Factories\SpesaFactory::new();
    }

    // Puoi aggiungere qui altri metodi helper o relazioni se necessario.
    // Esempio: un metodo per formattare l'importo
    // public function getFormattedAmountAttribute(): string { return number_format($this->amount, 2) . ' â‚¬'; }
}

