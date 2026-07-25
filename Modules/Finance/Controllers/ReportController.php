<?php

namespace Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Finance\Interfaces\ReportRepositoryInterface;

class ReportController extends Controller
{
    protected $reportRepo;
    protected $reportService;

    public function __construct(ReportRepositoryInterface $reportRepo, \Modules\Finance\Services\ReportService $reportService)
    {
        $this->reportRepo = $reportRepo;
        $this->reportService = $reportService;
    }

    public function index()
    {
        $metrics = $this->reportService->getDashboardMetrics();
        $chartData = $this->reportService->getIncomeChartData();
        $arrearsByClass = $this->reportService->getArrearsByClass();

        return Inertia::render('Reports/Index', [
            'metrics' => $metrics,
            'chartData' => $chartData,
            'arrearsByClass' => $arrearsByClass
        ]);
    }
}
