<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Core\Interfaces\DashboardRepositoryInterface;

class DashboardController extends Controller
{
    protected $dashboardRepo;

    public function __construct(DashboardRepositoryInterface $dashboardRepo)
    {
        $this->dashboardRepo = $dashboardRepo;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isYayasan()) {
            return redirect()->route('executive.dashboard');
        }

        if ($user->isTataUsaha()) {
            $data = $this->dashboardRepo->getAdminMetrics();
            return Inertia::render('Dashboard/AdminDashboard', $data);
        }

        // Student Role
        $student = $user->student;
        $data = $this->dashboardRepo->getStudentMetrics($student);
        
        return Inertia::render('Dashboard/StudentDashboard', $data);
    }

    public function executive(Request $request)
    {
        $data = $this->dashboardRepo->getExecutiveMetrics();
        
        return Inertia::render('Dashboard/ExecutiveDashboard', $data);
    }
}
