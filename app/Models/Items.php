<?php

namespace App\Models;

use App\Models\Categories;
use App\Models\TransactionDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Items extends Model
{
    protected $table = 'items';
    
    protected $fillable = [
        'category_id',
        'item_code',
        'name',
        'description',
        'stock',
        'min_stock',
        'price',
        'unit'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'item_id');
    }
}