<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'bill_id',
        'discount_amount',
        'reason',
        'status',
        'approved_by',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
