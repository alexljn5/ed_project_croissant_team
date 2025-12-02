<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $table = 'content';   // ← DIT IS DE MAGISCHE REGEL
    protected $guarded = [];
    protected $casts = [
        'value' => 'array'
    ];
}