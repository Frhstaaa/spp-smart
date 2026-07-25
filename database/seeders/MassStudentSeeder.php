<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Angkatan;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class MassStudentSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');
        $password = Hash::make('password123');

        $configurations = [
            ['year' => '2024/2025', 'classes_count' => 8, 'students_per_class' => 30],
            ['year' => '2025/2026', 'classes_count' => 8, 'students_per_class' => 20],
            ['year' => '2026/2027', 'classes_count' => 8, 'students_per_class' => 25],
        ];

        // Disable query log to save memory during mass insert
        DB::disableQueryLog();

        DB::beginTransaction();
        try {
            foreach ($configurations as $config) {
                // Create Angkatan
                $angkatan = Angkatan::firstOrCreate(
                    ['year' => $config['year']],
                    ['name' => 'Angkatan ' . $config['year']]
                );

                for ($i = 1; $i <= $config['classes_count']; $i++) {
                    // Create Class e.g. "X IPA 1 (2024/2025)"
                    $className = "Kelas " . $i . " - " . $config['year'];
                    $schoolClass = SchoolClass::firstOrCreate(
                        ['name' => $className],
                        ['level' => '10']
                    );

                    for ($j = 1; $j <= $config['students_per_class']; $j++) {
                        $gender = $faker->randomElement(['L', 'P']); // In Indonesia usually L/P
                        $studentName = $faker->name($gender === 'L' ? 'male' : 'female');
                        $nis = $faker->unique()->numerify('#####');
                        
                        $user = User::create([
                            'name' => $studentName,
                            'email' => $nis . '@sekolah.com',
                            'password' => $password,
                            'role' => 'siswa'
                        ]);

                        Student::create([
                            'user_id' => $user->id,
                            'school_class_id' => $schoolClass->id,
                            'angkatan_id' => $angkatan->id,
                            'nis' => $nis,
                            'nik' => $faker->unique()->numerify('320##########'),
                            'name' => $studentName,
                            'gender' => $gender,
                            'birth_place' => $faker->city,
                            'birth_date' => $faker->date(),
                            'address' => $faker->address,
                            'father_name' => $faker->name('male'),
                            'mother_name' => $faker->name('female'),
                            'parent_phone' => $faker->phoneNumber,
                            'is_active' => true,
                            'is_paid_yearly' => false,
                        ]);
                    }
                }
            }
            DB::commit();
            $this->command->info('Berhasil mengenerate 600 siswa beserta akun loginnya!');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Gagal generate: ' . $e->getMessage());
        }
    }
}
