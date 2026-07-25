<?php

namespace Modules\Academic\Repositories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Modules\Academic\Interfaces\StudentRepositoryInterface;

class StudentRepository implements StudentRepositoryInterface
{
    public function getAll($filters = [])
    {
        $query = Student::with(['user', 'school_class', 'angkatan']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nis', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nik', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['class_id'])) {
            $query->where('school_class_id', $filters['class_id']);
        }

        return $query->latest()->get();
    }

    public function findById($id)
    {
        return Student::with('user')->findOrFail($id);
    }

    public function create(array $data)
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

            return Student::create([
                'user_id' => $user ? $user->id : null,
                'school_class_id' => $data['class_id'],
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

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $student = $this->findById($id);

            $student->update([
                'school_class_id' => $data['class_id'],
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

            return $student;
        });
    }

    public function delete($id)
    {
        $student = $this->findById($id);
        
        // Also delete the linked user account if it exists
        if ($student->user) {
            $student->user->delete();
        }

        return $student->delete();
    }
}
