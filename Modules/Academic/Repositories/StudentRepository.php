<?php

namespace Modules\Academic\Repositories;

use App\Models\Student;
use Modules\Academic\Interfaces\StudentRepositoryInterface;

class StudentRepository implements StudentRepositoryInterface
{
    public function getAll($filters = [])
    {
        $query = Student::with(['user', 'schoolClass', 'angkatan']);

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
        return Student::create($data);
    }

    public function update($id, array $data)
    {
        $student = $this->findById($id);
        $student->update($data);
        return $student;
    }

    public function delete($id)
    {
        $student = $this->findById($id);
        return $student->delete();
    }
}
