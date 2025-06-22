<?php

namespace App\Models;

use App\Models\User;
use App\Models\TransactionDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'transaction_code',
        'type',
        'transaction_date',
        'transaction_time',
        'user_id',
        'notes',
        'total'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }
}