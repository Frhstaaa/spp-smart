<?php

namespace Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Finance\Interfaces\PaymentRepositoryInterface;
use App\Models\Tariff;

class PaymentController extends Controller
{
    protected $paymentRepo;
    protected $paymentService;

    public function __construct(PaymentRepositoryInterface $paymentRepo, \Modules\Finance\Services\PaymentService $paymentService)
    {
        $this->paymentRepo = $paymentRepo;
        $this->paymentService = $paymentService;
    }

    public function cashIndex(Request $request)
    {
        return Inertia::render('Payments/CashIndex', [
            'pendingBills' => $this->paymentRepo->getPendingBills($request->search),
            'filters' => $request->only('search')
        ]);
    }

    public function cashStore(Request $request)
    {
        $validated = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'amount_paid' => 'required|numeric|min:0'
        ]);

        $payment = $this->paymentService->createCashPayment($validated);

        return redirect()->route('payments.receipt', $payment->id)->with('success', 'Pembayaran tunai berhasil dicatat.');
    }

    public function payDigital(Request $request, $billId)
    {
        $this->paymentService->createDigitalPayment($billId);

        return redirect()->route('siswa.bills')->with('success', 'Pembayaran sedang diproses dan menunggu konfirmasi dari Tata Usaha.');
    }
    
    public function payAdvance(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|numeric',
            'year' => 'required|numeric',
        ]);
        
        $studentId = auth()->user()->student->id;
        $this->paymentService->createAdvancePayment($validated, $studentId);
        
        return redirect()->route('siswa.bills')->with('success', 'Pembayaran sedang diproses dan menunggu konfirmasi dari Tata Usaha.');
    }

    public function paySelection(Request $request)
    {
        $student = $request->user()->student;
        $tariff = $student->sppTariff ?? Tariff::where('type', 'spp')->first();
        $bills = $this->paymentRepo->getStudentBillsForPayment($student->id);

        return Inertia::render('Bills/PaySelection', [
            'bills' => $bills,
            'tariff' => $tariff
        ]);
    }

    public function payMultiple(Request $request)
    {
        $validated = $request->validate([
            'months' => 'required|array|min:1',
            'months.*.month' => 'required|numeric|min:1|max:12',
            'months.*.year' => 'required|numeric',
        ]);

        $studentId = auth()->user()->student->id;
        $this->paymentService->createMultiplePayments($validated['months'], $studentId);

        return redirect()->route('siswa.bills')->with('success', 'Pembayaran untuk bulan-bulan terpilih sedang diproses dan menunggu konfirmasi dari Tata Usaha.');
    }

    public function myPayments(Request $request)
    {
        $student = $request->user()->student;
        $payments = $student ? $this->paymentRepo->getStudentPayments($student->id) : collect();
            
        return Inertia::render('Payments/MyPayments', ['payments' => $payments]);
    }

    public function printReceipt($paymentId)
    {
        $payment = $this->paymentRepo->getPaymentById($paymentId);
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
        
        return Inertia::render('Payments/Receipt', [
            'payment' => $payment,
            'settings' => $settings
        ]);
    }

    public function pendingIndex()
    {
        return Inertia::render('Payments/PendingIndex', [
            'pendingPayments' => $this->paymentRepo->getPendingPayments()
        ]);
    }

    public function approve($paymentId)
    {
        $success = $this->paymentService->approvePayment($paymentId);

        if (!$success) {
            return back()->with('error', 'Pembayaran ini sudah tidak berstatus pending.');
        }

        return back()->with('success', 'Pembayaran berhasil disetujui dan tagihan lunas.');
    }

    public function reject($paymentId)
    {
        $success = $this->paymentService->rejectPayment($paymentId);

        if (!$success) {
            return back()->with('error', 'Pembayaran ini sudah tidak berstatus pending.');
        }

        return back()->with('success', 'Pembayaran berhasil ditolak.');
    }

    public function downloadReceiptPdf($paymentId)
    {
        $payment = $this->paymentRepo->getPaymentById($paymentId);
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.receipt', compact('payment', 'settings'));
        $pdf->setPaper('a5', 'landscape');
        
        return $pdf->download('Kuitansi_Pembayaran_' . $payment->transaction_id . '.pdf');
    }
}
