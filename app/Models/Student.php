<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory, \App\Traits\LogsActivity;

    protected $fillable = [
        'user_id',
        'school_class_id',
        'nis',
        'nik',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'address',
        'father_name',
        'mother_name',
        'guardian_name',
        'parent_job',
        'parent_phone',
        'is_active',
        'is_paid_yearly',
        'angkatan_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    public function school_class()
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    public function angkatan()
    {
        return $this->belongsTo(Angkatan::class, 'angkatan_id');
    }

    public function getSppTariffAttribute()
    {
        if (!$this->angkatan_id) {
            return Tariff::where('type', 'spp')->whereNull('angkatan_id')->first();
        }
        
        return Tariff::where('type', 'spp')
            ->where('angkatan_id', $this->angkatan_id)
            ->first() ?? Tariff::where('type', 'spp')->whereNull('angkatan_id')->first();
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }
}
