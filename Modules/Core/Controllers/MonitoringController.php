<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Core\Interfaces\MonitoringRepositoryInterface;
use App\Models\SchoolClass;
use App\Models\Angkatan;

class MonitoringController extends Controller
{
    protected $monitoringRepo;

    public function __construct(MonitoringRepositoryInterface $monitoringRepo)
    {
        $this->monitoringRepo = $monitoringRepo;
    }

    public function index(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $classId = $request->input('class_id', 'all');
        $angkatanId = $request->input('angkatan_id', 'all');
        $search = $request->input('search', '');

        $students = $this->monitoringRepo->getStudentMonitoringData($year, $classId, $angkatanId, $search);

        $classes = SchoolClass::orderBy('name', 'asc')->get();
        $angkatans = Angkatan::orderBy('year', 'desc')->get();

        return Inertia::render('Monitoring/Index', [
            'students' => $students,
            'classes' => $classes,
            'angkatans' => $angkatans,
            'filters' => [
                'year' => $year,
                'class_id' => $classId,
                'angkatan_id' => $angkatanId,
                'search' => $search
            ]
        ]);
    }
}
