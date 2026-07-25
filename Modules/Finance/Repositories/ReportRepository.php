<?php

namespace Modules\Finance\Repositories;

use App\Models\Payment;
use App\Models\Bill;
use Carbon\Carbon;
use Modules\Finance\Interfaces\ReportRepositoryInterface;

class ReportRepository implements ReportRepositoryInterface
{
    public function getDashboardMetrics()
    {
        $now = Carbon::now();
        
        $incomeThisMonth = Payment::where('status', 'success')
            ->whereMonth('payment_date', $now->month)
            ->whereYear('payment_date', $now->year)
            ->sum('amount');
            
        $incomeThisYear = Payment::where('status', 'success')
            ->whereYear('payment_date', $now->year)
            ->sum('amount');
            
        $arrears = Bill::where('status', '!=', 'paid')
            ->where('due_date', '<', Carbon::now())
            ->sum('amount');

        return [
            'incomeThisMonth' => $incomeThisMonth,
            'incomeThisYear' => $incomeThisYear,
            'totalArrears' => $arrears
        ];
    }

    public function getIncomeChartData($days = 30)
    {
        return Payment::selectRaw('DATE(payment_date) as date, SUM(amount) as total')
            ->where('status', 'success')
            ->where('payment_date', '>=', Carbon::now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();
    }

    public function getArrearsByClass()
    {
        return Bill::where('status', '!=', 'paid')
            ->where('due_date', '<', Carbon::now())
            ->with('student.schoolClass')
            ->get()
            ->groupBy(function($bill) {
                return $bill->student && $bill->student->schoolClass ? $bill->student->schoolClass->name : 'Tanpa Kelas';
            })
            ->map(function($bills) {
                return $bills->sum('amount');
            });
    }
}
