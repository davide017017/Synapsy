# Proposed Renaming Plan

## Unify `entrate` and `spese` → `transactions`
- **Motivation**: single table simplifies queries and allows `type` field (`entrata`/`spesa`).
- **Steps**:
 1. Create new `transactions` table with `type` enum, copy data from existing tables.
 2. Create views `entrate` and `spese` for backward compatibility or update API.
 3. Migrate foreign keys from old tables to new `transactions` table.

```php
// ─────────────────────────────────────────────────────────────────────────────
// Migrazione di esempio: unificazione 'entrate' + 'spese' → 'transactions' (BOZZA)
// NOTE: Solo template illustrativo. Non applicare senza piano di migrazione dati.
// ─────────────────────────────────────────────────────────────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $t->enum('type', ['entrata','spesa']);
            $t->decimal('amount', 12, 2);
            $t->date('date');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->index(['user_id','date']);
            $t->index(['category_id','type']);
        });
        // TODO: copy data from entrate/spese → transactions
        // TODO: create VIEW entrate/spese or update API
    }
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```

## `recurring_operations` → `recurring_transactions`
- **Motivation**: aligns with unified terminology.
- **Migration sketch**: create `recurring_transactions` with same columns and type field.

## `audit_logs` → `activity_logs`
- **Motivation**: clearer semantics, matches common naming.
- **Migration sketch**: rename table then create view `audit_logs` for compatibility.

## Language consistency
- Consider renaming remaining tables to English equivalents (`entrate`→`incomes` if not unified, `spese`→`expenses`).
- Ensure column names use snake_case English: e.g., `description`, `amount`, `next_occurrence_date`.

### Risk & Strategy
- Use blue/green deployment: create new tables, backfill, switch API, drop old tables after validation.
- Ensure migrations are idempotent and run in maintenance windows.
