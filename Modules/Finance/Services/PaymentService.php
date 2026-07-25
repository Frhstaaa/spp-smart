<?php

namespace Modules\Finance\Services;

use App\Models\Tariff;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Modules\Finance\Interfaces\PaymentRepositoryInterface;

class PaymentService
{
    protected $paymentRepo;

    public function __construct(PaymentRepositoryInterface $paymentRepo)
    {
        $this->paymentRepo = $paymentRepo;
    }

    public function createCashPayment(array $data)
    {
        return DB::transaction(function () use ($data) {
            $bill = $this->paymentRepo->getBillById($data['bill_id']);
            
            $payment = $this->paymentRepo->createPayment([
                'bill_id' => $bill->id,
                'payment_date' => now(),
                'amount' => $data['amount_paid'],
                'method' => 'cash',
                'status' => 'success',
                'cashier_id' => auth()->id(),
                'transaction_id' => 'CASH-' . time() . '-' . $bill->id,
            ]);

            $this->paymentRepo->updateBill($bill->id, ['status' => 'paid']);
            
            // Re-fetch to ensure relations are loaded for notifications if needed, 
            // but normally we can just use the bill instance
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
            $bill = $this->paymentRepo->getBillById($billId);
            
            return $this->paymentRepo->createPayment([
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
        
        $dueDate = Carbon::createFromDate((int)$data['year'], (int)$data['month'], 1)->endOfMonth();
        
        $bill = $this->paymentRepo->firstOrCreateBill([
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
                $dueDate = Carbon::createFromDate((int)$m['year'], (int)$m['month'], 1)->endOfMonth();
                
                $bill = $this->paymentRepo->firstOrCreateBill([
                    'student_id' => $student->id,
                    'tariff_id' => $tariff->id,
                    'month' => $m['month'],
                    'year' => $m['year']
                ], [
                    'amount' => $tariff->amount,
                    'due_date' => $dueDate,
                    'status' => 'pending'
                ]);

                $pendingPayment = $this->paymentRepo->findPendingPaymentForBill($bill->id);

                if (!$pendingPayment && $bill->status !== 'paid') {
                    $this->paymentRepo->createPayment([
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

    public function approvePayment($paymentId)
    {
        return DB::transaction(function () use ($paymentId) {
            $payment = $this->paymentRepo->getPaymentById($paymentId);
            if ($payment->status !== 'pending') return false;

            $payment = $this->paymentRepo->updatePayment($paymentId, ['status' => 'success']);

            if ($payment->bill) {
                $this->paymentRepo->updateBill($payment->bill_id, ['status' => 'paid']);
                
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
        $payment = $this->paymentRepo->getPaymentById($paymentId);
        if ($payment->status !== 'pending') return false;

        $this->paymentRepo->updatePayment($paymentId, ['status' => 'failed']);
        return true;
    }
}
