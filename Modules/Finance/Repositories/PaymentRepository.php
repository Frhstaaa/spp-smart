<?php

namespace Modules\Finance\Repositories;

use App\Models\Payment;
use App\Models\Bill;
use App\Models\Tariff;
use Modules\Finance\Interfaces\PaymentRepositoryInterface;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function getPendingBills($search = null)
    {
        $query = Bill::with(['student.schoolClass', 'tariff'])->where('status', '!=', 'paid');
        
        if (!empty($search)) {
            $query->whereHas('student', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        } else {
            $query->limit(50);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getStudentBillsForPayment($studentId)
    {
        $student = \App\Models\Student::findOrFail($studentId);
        $tariff = $student->sppTariff ?? Tariff::where('type', 'spp')->first();

        return Bill::where('student_id', $student->id)
                   ->where('tariff_id', $tariff->id)
                   ->get();
    }

    public function getStudentPayments($studentId)
    {
        return Payment::whereHas('bill', function($q) use($studentId) {
                $q->where('student_id', $studentId);
            })->with('bill.tariff')->orderBy('payment_date', 'desc')->get();
    }

    public function getPaymentById($paymentId)
    {
        return Payment::with(['bill.student.schoolClass', 'bill.tariff', 'cashier'])->findOrFail($paymentId);
    }

    public function getPendingPayments()
    {
        return Payment::with(['bill.student.schoolClass', 'bill.tariff'])
            ->where('status', 'pending')
            ->orderBy('payment_date', 'asc')
            ->get();
    }
    
    // Data Access Core
    
    public function createPayment(array $data)
    {
        return Payment::create($data);
    }
    
    public function updatePayment(int $paymentId, array $data)
    {
        $payment = Payment::findOrFail($paymentId);
        $payment->update($data);
        return $payment;
    }
    
    public function getBillById(int $billId)
    {
        return Bill::findOrFail($billId);
    }
    
    public function updateBill(int $billId, array $data)
    {
        $bill = Bill::findOrFail($billId);
        $bill->update($data);
        return $bill;
    }
    
    public function findPendingPaymentForBill(int $billId)
    {
        return Payment::where('bill_id', $billId)->where('status', 'pending')->first();
    }
    
    public function firstOrCreateBill(array $attributes, array $values)
    {
        return Bill::firstOrCreate($attributes, $values);
    }
}
