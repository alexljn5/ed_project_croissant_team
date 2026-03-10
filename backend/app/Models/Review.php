<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'text',
        'stars',
        'name',
        'email',
        'anonymous',
        'image_url',
        'pending',
    ];
}
