<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $table = 'content'; // Wijst naar 'content' table in plaats van 'page_contents'
    protected $fillable = ['key', 'value'];

    // Tell Laravel that "value" is JSON and should be automatically converted to array
    protected $casts = [
        'value' => 'array'
    ];
}