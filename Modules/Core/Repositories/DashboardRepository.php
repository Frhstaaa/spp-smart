<?php

namespace Modules\Core\Repositories;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\DiscountRequest;
use Modules\Core\Interfaces\DashboardRepositoryInterface;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getBillsCount($month, $year, $status = null)
    {
        $query = Bill::where('month', $month)->where('year', $year);
        if ($status) {
            $query->where('status', $status);
        }
        return $query->count();
    }

    public function getCashPaymentsToday()
    {
        return Payment::whereDate('payment_date', date('Y-m-d'))
            ->where('method', 'cash')
            ->where('status', 'success')
            ->sum('amount');
    }

    public function getRecentTransactions($limit = 5)
    {
        return Payment::with(['bill.student.user'])
            ->orderBy('payment_date', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getTotalExpenses($month = null, $year = null)
    {
        $query = \App\Models\Expense::query();
        if ($month && $year) {
            $query->whereMonth('expense_date', $month)->whereYear('expense_date', $year);
        }
        return $query->sum('amount');
    }

    public function getTotalIncome($month = null, $year = null)
    {
        $query = Payment::where('status', 'success');
        if ($month && $year) {
            $query->whereMonth('payment_date', $month)->whereYear('payment_date', $year);
        }
        return $query->sum('amount');
    }

    public function getStudentCurrentBill($studentId)
    {
        return Bill::with(['tariff', 'payments' => function($q) {
                $q->where('status', 'pending');
            }])
            ->where('student_id', $studentId)
            ->where('status', '!=', 'paid')
            ->orderBy('due_date', 'asc')
            ->first();
    }

    public function getStudentRecentPayments($studentId, $limit = 5)
    {
        return Payment::with(['bill.tariff'])->whereHas('bill', function($q) use ($studentId) {
                $q->where('student_id', $studentId);
            })
            ->orderBy('payment_date', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getStudentBillsByTariff($studentId, $tariffId)
    {
        return Bill::with(['payments' => function($q) {
                $q->where('status', 'pending');
            }])
            ->where('student_id', $studentId)
            ->where('tariff_id', $tariffId)
            ->get();
    }

    public function getTotalArrears()
    {
        return Bill::where('status', 'unpaid')->sum('amount');
    }

    public function getPendingDiscounts()
    {
        return DiscountRequest::with(['student.user', 'bill'])
            ->where('status', 'pending')
            ->get();
    }
    
    public function getIncomeByMonth($month, $year)
    {
        return Payment::whereMonth('payment_date', $month)
            ->whereYear('payment_date', $year)
            ->where('status', 'success')
            ->sum('amount');
    }
}
