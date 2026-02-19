<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TextSegment extends Model
{
    protected $table = 'text_segments';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'description',
        'image',
        'order_index',
    ];
}
