<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = ['key', 'value'];

    // Tell Laravel that "value" is JSON and should be automatically converted to array
    protected $casts = [
        'value' => 'array'
    ];
}