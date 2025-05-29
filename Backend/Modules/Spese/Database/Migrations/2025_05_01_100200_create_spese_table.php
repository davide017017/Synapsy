<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea la tabella `spese`.
     */
    public function up(): void
    {
        Schema::create('spese', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('date');
            $table->unique(['user_id', 'date', 'description']); // 🔐 Vincolo unico per test
        });
    }

    /**
     * Elimina la tabella `spese`.
     */
    public function down(): void
    {
        Schema::dropIfExists('spese');
    }
};
