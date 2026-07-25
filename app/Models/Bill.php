<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory, \App\Traits\LogsActivity;

    protected $fillable = [
        'student_id',
        'tariff_id',
        'month',
        'year',
        'amount',
        'due_date',
        'status',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function discountRequests()
    {
        return $this->hasMany(DiscountRequest::class);
    }
}
