<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory, \App\Traits\LogsActivity;

    protected $fillable = [
        'bill_id',
        'amount',
        'method',
        'status',
        'payment_date',
        'transaction_id',
        'cashier_id',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }
}
