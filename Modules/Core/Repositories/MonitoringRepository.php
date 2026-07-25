<?php

namespace Modules\Core\Repositories;

use App\Models\Student;
use Modules\Core\Interfaces\MonitoringRepositoryInterface;

class MonitoringRepository implements MonitoringRepositoryInterface
{
    public function getStudentMonitoringData($year, $classId = 'all', $angkatanId = 'all', $search = '')
    {
        $studentsQuery = Student::with([
            'schoolClass',
            'angkatan',
            'bills' => function ($query) use ($year) {
                $query->where('year', $year);
            },
            'bills.tariff'
        ])->where('is_active', true);

        if ($classId !== 'all') {
            $studentsQuery->where('school_class_id', $classId);
        }

        if ($angkatanId !== 'all') {
            $studentsQuery->where('angkatan_id', $angkatanId);
        }

        if (!empty($search)) {
            $studentsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        return $studentsQuery->orderBy('name', 'asc')->get();
    }
}
