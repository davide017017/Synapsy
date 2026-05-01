<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Drops the test-only unique(user_id, date, description) constraints that were
// never meant for production. Uses IF EXISTS so each statement is idempotent:
// safe to re-run after a partial failure, and safe when a constraint was never
// created or was already dropped manually.
//
// withinTransaction = false: DDL outside a transaction prevents PostgreSQL from
// entering the 25P02 "current transaction is aborted" state if one statement
// fails, keeping the other statement independent.
return new class extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        DB::statement('ALTER TABLE spese   DROP CONSTRAINT IF EXISTS spese_user_id_date_description_unique');
        DB::statement('ALTER TABLE entrate DROP CONSTRAINT IF EXISTS entrate_user_id_date_description_unique');
    }

    public function down(): void
    {
        // Re-add only when absent (idempotent rollback).
        DB::statement("
            DO \$\$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname    = 'spese_user_id_date_description_unique'
                      AND conrelid   = 'spese'::regclass
                ) THEN
                    ALTER TABLE spese
                        ADD CONSTRAINT spese_user_id_date_description_unique
                        UNIQUE (user_id, date, description);
                END IF;
            END \$\$
        ");

        DB::statement("
            DO \$\$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname    = 'entrate_user_id_date_description_unique'
                      AND conrelid   = 'entrate'::regclass
                ) THEN
                    ALTER TABLE entrate
                        ADD CONSTRAINT entrate_user_id_date_description_unique
                        UNIQUE (user_id, date, description);
                END IF;
            END \$\$
        ");
    }
};
