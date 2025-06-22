<?php

use App\Models\Items;
use App\Models\TransactionDetail;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add item_unit column
        Schema::table('transaction_details', function (Blueprint $table) {
            if (!Schema::hasColumn('transaction_details', 'item_unit')) {
                $table->string('item_unit', 20)->nullable()->after('item_name');
            }
        });

        // Backfill item_unit from items.unit
        TransactionDetail::with('item')->chunk(100, function ($details) {
            foreach ($details as $detail) {
                if ($detail->item && $detail->item_unit === null) {
                    $detail->update([
                        'item_unit' => $detail->item->unit,
                    ]);
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropColumn('item_unit');
        });
    }
};