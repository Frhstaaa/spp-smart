<?php

namespace Modules\Finance\Interfaces;

interface ReportRepositoryInterface
{
    public function getDashboardMetrics();
    public function getIncomeChartData($days = 30);
    public function getArrearsByClass();
}
