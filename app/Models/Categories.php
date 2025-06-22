<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categories extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name'
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Items::class, 'category_id');
    }
}