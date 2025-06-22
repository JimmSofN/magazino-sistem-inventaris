<?php

namespace App\Models;

use App\Models\Items;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    protected $table = 'transaction_details';

    protected $fillable = [
        'transaction_id',
        'item_id',
        'item_name',
        'price',
        'item_unit',
        'quantity',
        'subtotal',
    ];

    protected $primaryKey = 'id'; 

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Items::class, 'item_id', 'id');
    }

}