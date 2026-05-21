<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'gst_number',
        'address',
        'state',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}