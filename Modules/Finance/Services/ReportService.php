<?php

namespace Modules\Finance\Services;

use Modules\Finance\Interfaces\ReportRepositoryInterface;

class ReportService
{
    protected $reportRepo;

    public function __construct(ReportRepositoryInterface $reportRepo)
    {
        $this->reportRepo = $reportRepo;
    }

    public function getDashboardMetrics()
    {
        return $this->reportRepo->getDashboardMetrics();
    }

    public function getIncomeChartData($days = 30)
    {
        return $this->reportRepo->getIncomeChartData($days);
    }

    public function getArrearsByClass()
    {
        return $this->reportRepo->getArrearsByClass();
    }
}
