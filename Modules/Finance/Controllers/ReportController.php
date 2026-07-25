<?php

namespace Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Finance\Interfaces\ReportRepositoryInterface;

class ReportController extends Controller
{
    protected $reportRepo;

    public function __construct(ReportRepositoryInterface $reportRepo)
    {
        $this->reportRepo = $reportRepo;
    }

    public function index()
    {
        $metrics = $this->reportRepo->getDashboardMetrics();
        $chartData = $this->reportRepo->getIncomeChartData();
        $arrearsByClass = $this->reportRepo->getArrearsByClass();

        return Inertia::render('Reports/Index', [
            'metrics' => $metrics,
            'chartData' => $chartData,
            'arrearsByClass' => $arrearsByClass
        ]);
    }
}
