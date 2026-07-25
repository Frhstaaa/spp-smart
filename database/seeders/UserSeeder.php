<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name'     => 'Super Admin TaskFlow',
                'email'    => 'superadmin@company.com',
                'password' => Hash::make('password'),
                'role'     => 'super_admin',
            ],
            [
                'name'     => 'Manager Operational',
                'email'    => 'admin@company.com',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'Staff Karyawan 1',
                'email'    => 'karyawan@company.com',
                'password' => Hash::make('password'),
                'role'     => 'karyawan',
            ],
            [
                'name'     => 'Staff Karyawan 2',
                'email'    => 'karyawan2@company.com',
                'password' => Hash::make('password'),
                'role'     => 'karyawan',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }

        $this->command->info('✅ 4 user berhasil dibuat: superadmin, admin, karyawan, karyawan2 (password: password)');
    }
}
