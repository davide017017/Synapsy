<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public $withinTransaction = false;

  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      if (!Schema::hasColumn('users', 'last_demo_reseed_at')) {
        $table->timestamp('last_demo_reseed_at')->nullable()->after('is_demo');
      }
    });
  }

  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      if (Schema::hasColumn('users', 'last_demo_reseed_at')) {
        $table->dropColumn('last_demo_reseed_at');
      }
    });
  }
};
