<?php

namespace Modules\Finance\Repositories;

use App\Models\Bill;
use App\Models\DiscountRequest;
use Modules\Finance\Interfaces\BillRepositoryInterface;

class BillRepository implements BillRepositoryInterface
{
    public function getAllBills()
    {
        return Bill::with(['student.schoolClass', 'tariff'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getStudentBills($studentId)
    {
        return Bill::with([
            'tariff', 
            'discountRequests' => function($q) {
                $q->where('status', 'pending');
            }, 
            'payments' => function($q) {
                $q->where('status', 'pending');
            }
        ])->where('student_id', $studentId)
          ->orderBy('due_date', 'asc')
          ->get();
    }

    public function findById(int $id)
    {
        return Bill::findOrFail($id);
    }

    public function create(array $data)
    {
        return Bill::create($data);
    }

    public function checkBillExists(int $studentId, int $tariffId, int $month, int $year): bool
    {
        return Bill::where('student_id', $studentId)
            ->where('tariff_id', $tariffId)
            ->where('month', $month)
            ->where('year', $year)
            ->exists();
    }

    public function deleteBill(int $id)
    {
        $bill = Bill::findOrFail($id);
        return $bill->delete();
    }

    public function hasPendingDiscountRequest(int $billId): bool
    {
        $bill = Bill::findOrFail($billId);
        return $bill->discountRequests()->where('status', 'pending')->exists();
    }

    public function createDiscountRequest(array $data)
    {
        return DiscountRequest::create($data);
    }

    public function findDiscountRequestById(int $id)
    {
        return DiscountRequest::findOrFail($id);
    }

    public function updateDiscountRequest(int $id, array $data)
    {
        $discountRequest = DiscountRequest::findOrFail($id);
        $discountRequest->update($data);
        return $discountRequest;
    }
}
