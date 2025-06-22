<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('total', 15, 2)->default(0.00)->after('notes');
        });

        // Optional: Backfill existing transactions
        DB::table('transactions')->update([
            'total' => DB::raw('(
                SELECT COALESCE(SUM(subtotal), 0)
                FROM transaction_details
                WHERE transaction_details.transaction_id = transactions.id
            )'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            //
        });
    }
};