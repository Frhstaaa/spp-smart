<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Yayasan / Admin
        User::updateOrCreate(
            ['email' => 'admin@yayasan.com'],
            [
                'name' => 'Admin Yayasan',
                'password' => Hash::make('password123'),
                'role' => 'yayasan',
            ]
        );

        // 2. Tata Usaha
        User::updateOrCreate(
            ['email' => 'tu@sekolah.com'],
            [
                'name' => 'Tata Usaha 1',
                'password' => Hash::make('password123'),
                'role' => 'tata_usaha',
            ]
        );

        // 3. Siswa/Orang Tua
        User::updateOrCreate(
            ['email' => 'siswa@sekolah.com'],
            [
                'name' => 'Orang Tua / Siswa',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
            ]
        );
    }
}
