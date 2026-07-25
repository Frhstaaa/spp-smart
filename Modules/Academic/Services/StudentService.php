<?php

namespace Modules\Academic\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Modules\Academic\Interfaces\StudentRepositoryInterface;

class StudentService
{
    protected $studentRepo;

    public function __construct(StudentRepositoryInterface $studentRepo)
    {
        $this->studentRepo = $studentRepo;
    }

    public function createStudent(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = null;
            if (!empty($data['email'])) {
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['nis']), // Default password is NIS
                    'role' => 'siswa',
                ]);
            }

            return $this->studentRepo->create([
                'user_id' => $user ? $user->id : null,
                'school_class_id' => $data['class_id'] ?? null,
                'nis' => $data['nis'],
                'nik' => $data['nik'] ?? null,
                'name' => $data['name'],
                'gender' => $data['gender'] ?? null,
                'birth_place' => $data['birth_place'] ?? null,
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'father_name' => $data['father_name'] ?? null,
                'mother_name' => $data['mother_name'] ?? null,
                'guardian_name' => $data['guardian_name'] ?? null,
                'parent_job' => $data['parent_job'] ?? null,
                'parent_phone' => $data['phone'] ?? null,
                'is_paid_yearly' => $data['is_paid_yearly'] ?? false,
                'angkatan_id' => $data['angkatan_id'] ?? null,
            ]);
        });
    }

    public function updateStudent($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $student = $this->studentRepo->findById($id);

            $this->studentRepo->update($id, [
                'school_class_id' => $data['class_id'] ?? null,
                'nis' => $data['nis'],
                'nik' => $data['nik'] ?? null,
                'name' => $data['name'],
                'gender' => $data['gender'] ?? null,
                'birth_place' => $data['birth_place'] ?? null,
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'father_name' => $data['father_name'] ?? null,
                'mother_name' => $data['mother_name'] ?? null,
                'guardian_name' => $data['guardian_name'] ?? null,
                'parent_job' => $data['parent_job'] ?? null,
                'parent_phone' => $data['phone'] ?? null,
                'is_paid_yearly' => $data['is_paid_yearly'] ?? false,
                'angkatan_id' => $data['angkatan_id'] ?? null,
            ]);

            if ($student->user && !empty($data['password'])) {
                $student->user->update([
                    'password' => Hash::make($data['password'])
                ]);
            }

            return $this->studentRepo->findById($id);
        });
    }

    public function deleteStudent($id)
    {
        return DB::transaction(function () use ($id) {
            $student = $this->studentRepo->findById($id);
            if ($student->user) {
                $student->user->delete();
            }
            return $this->studentRepo->delete($id);
        });
    }
}
