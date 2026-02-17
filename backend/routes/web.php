<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Content;

Route::get(uri: '/newEmpty', action: function (): View {
    return view(view: 'empty');
});