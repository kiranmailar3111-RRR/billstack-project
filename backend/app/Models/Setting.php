<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'business_name',
        'gst_number',
        'email',
        'phone',
        'address',
        'logo',
        'signature',
    ];
}