<?php

namespace Modules\Finance\Repositories;

use App\Models\Payment;
use App\Models\Bill;
use App\Models\Tariff;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Modules\Finance\Interfaces\PaymentRepositoryInterface;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function getPendingBills()
    {
        return Bill::with(['student.schoolClass', 'tariff'])->where('status', '!=', 'paid')->get();
    }

    public function createCashPayment(array $data)
    {
        return DB::transaction(function () use ($data) {
            $bill = Bill::findOrFail($data['bill_id']);
            $payment = Payment::create([
                'bill_id' => $bill->id,
                'payment_date' => now(),
                'amount' => $data['amount_paid'],
                'method' => 'cash',
                'transaction_id' => 'CASH-' . time() . '-' . $bill->id,
            ]);

            $bill->update(['status' => 'paid']);
            
            if ($bill->student && $bill->student->user) {
                $bill->student->user->notify(new \App\Notifications\PaymentConfirmedNotification($payment));
            }
            
            // Send WA Receipt
            app(\App\Services\WhatsAppService::class)->sendReceipt($payment);
            
            return $payment;
        });
    }

    public function createDigitalPayment($billId)
    {
        return DB::transaction(function () use ($billId) {
            $bill = Bill::findOrFail($billId);
            return Payment::create([
                'bill_id' => $bill->id,
                'payment_date' => now(),
                'amount' => $bill->amount,
                'method' => 'qris',
                'status' => 'pending',
                'transaction_id' => 'DGT-' . time() . '-' . $bill->id,
            ]);
        });
    }

    public function createAdvancePayment(array $data, $studentId)
    {
        $student = \App\Models\Student::findOrFail($studentId);
        $tariff = $student->sppTariff ?? Tariff::where('type', 'spp')->first();
        
        $dueDate = Carbon::createFromDate($data['year'], $data['month'], 1)->endOfMonth();
        
        $bill = Bill::firstOrCreate([
            'student_id' => $student->id,
            'tariff_id' => $tariff->id,
            'month' => $data['month'],
            'year' => $data['year']
        ], [
            'amount' => $tariff->amount,
            'due_date' => $dueDate,
            'status' => 'pending'
        ]);
        
        return $this->createDigitalPayment($bill->id);
    }

    public function createMultiplePayments(array $monthsData, $studentId)
    {
        $student = \App\Models\Student::findOrFail($studentId);
        $tariff = $student->sppTariff ?? Tariff::where('type', 'spp')->first();

        DB::transaction(function () use ($monthsData, $student, $tariff) {
            foreach ($monthsData as $m) {
                $dueDate = Carbon::createFromDate($m['year'], $m['month'], 1)->endOfMonth();
                
                $bill = Bill::firstOrCreate([
                    'student_id' => $student->id,
                    'tariff_id' => $tariff->id,
                    'month' => $m['month'],
                    'year' => $m['year']
                ], [
                    'amount' => $tariff->amount,
                    'due_date' => $dueDate,
                    'status' => 'pending'
                ]);

                $hasPendingPayment = Payment::where('bill_id', $bill->id)->where('status', 'pending')->exists();

                if (!$hasPendingPayment && $bill->status !== 'paid') {
                    Payment::create([
                        'bill_id' => $bill->id,
                        'payment_date' => now(),
                        'amount' => $bill->amount,
                        'method' => 'qris',
                        'status' => 'pending', 
                        'transaction_id' => 'DGT-' . time() . '-' . $bill->id,
                    ]);
                }
            }
        });
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
        $payment = Payment::with(['bill.student.schoolClass', 'bill.tariff', 'cashier'])->findOrFail($paymentId);
        return $payment;
    }

    public function getPendingPayments()
    {
        return Payment::with(['bill.student.schoolClass', 'bill.tariff'])
            ->where('status', 'pending')
            ->orderBy('payment_date', 'asc')
            ->get();
    }

    public function approvePayment($paymentId)
    {
        return DB::transaction(function () use ($paymentId) {
            $payment = Payment::findOrFail($paymentId);
            if ($payment->status !== 'pending') return false;

            $payment->update(['status' => 'success']);

            if ($payment->bill) {
                $payment->bill->update(['status' => 'paid']);
                
                if ($payment->bill->student && $payment->bill->student->user) {
                    $payment->bill->student->user->notify(new \App\Notifications\PaymentConfirmedNotification($payment));
                }
                
                // Send WA Receipt
                app(\App\Services\WhatsAppService::class)->sendReceipt($payment);
            }
            return true;
        });
    }

    public function rejectPayment($paymentId)
    {
        $payment = Payment::findOrFail($paymentId);
        if ($payment->status !== 'pending') return false;

        $payment->update(['status' => 'failed']);
        return true;
    }
}
