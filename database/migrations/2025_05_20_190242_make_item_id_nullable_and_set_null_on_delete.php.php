<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['item_id']);

            // Make item_id nullable
            $table->bigInteger('item_id')->nullable()->change();

            // Re-add the foreign key with onDelete('set null')
            $table->foreign('item_id')
                  ->references('id')
                  ->on('items')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            // Drop the new foreign key
            $table->dropForeign(['item_id']);

            // Restore item_id as not nullable (assumes no null values exist)
            $table->bigInteger('item_id')->nullable(false)->change();

            // Restore the previous foreign key (NO ACTION)
            $table->foreign('item_id')
                  ->references('id')
                  ->on('items');
        });
    }
};