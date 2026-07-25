<?php

namespace Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Bill;
use App\Models\Student;
use App\Models\Tariff;
use App\Models\SchoolClass;
use App\Models\DiscountRequest;
use Modules\Finance\Interfaces\BillRepositoryInterface;

class BillController extends Controller
{
    protected $billRepository;

    public function __construct(BillRepositoryInterface $billRepository)
    {
        $this->billRepository = $billRepository;
    }

    public function index()
    {
        return Inertia::render('Bills/Index', [
            'bills' => $this->billRepository->getAllBills()
        ]);
    }

    public function createAuto()
    {
        return Inertia::render('Bills/Generate', [
            'tariffs' => Tariff::all(),
            'classes' => SchoolClass::all(),
            'students' => Student::where('is_active', true)->with('schoolClass')->get()
        ]);
    }

    public function storeAuto(Request $request)
    {
        $validated = $request->validate([
            'tariff_id' => 'required|exists:tariffs,id',
            'class_id' => 'nullable|exists:school_classes,id',
            'level' => 'nullable|string',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:students,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'due_date' => 'required|date',
            'generate_12_months' => 'nullable|boolean'
        ]);

        $generatedCount = $this->billRepository->generateAutoBills($validated);

        return redirect()->route('bills.index')->with('success', "$generatedCount Tagihan berhasil digenerate.");
    }

    public function myBills(Request $request)
    {
        $student = $request->user()->student;
        $bills = $student ? $this->billRepository->getStudentBills($student->id) : collect();
        return Inertia::render('Bills/MyBills', ['bills' => $bills]);
    }

    public function requestDiscount(Request $request, Bill $bill)
    {
        $request->validate([
            'discount_amount' => 'required|numeric|min:1|max:'.$bill->amount,
            'reason' => 'required|string|max:500'
        ]);

        $student = $request->user()->student;
        if (!$student) abort(403);

        try {
            $this->billRepository->submitDiscountRequest($bill->id, $student->id, $request->all());
            return back()->with('success', 'Pengajuan keringanan biaya berhasil dikirim dan sedang menunggu persetujuan yayasan.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function discounts()
    {
        // Ideally this logic should also be moved to a repository, but keeping it here for simplicity of refactoring Bill
        return Inertia::render('Bills/Discounts', [
            'requests' => \App\Models\DiscountRequest::with(['student', 'bill'])->get()
        ]);
    }

    public function approveDiscount(Request $request, $id) 
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $this->billRepository->updateDiscountStatus($id, $request->status, $request->user()->id);

        return back()->with('success', 'Status pengajuan keringanan berhasil diperbarui.');
    }
    
    public function store(Request $request) { }
    
    public function destroy($id) { 
        $this->billRepository->deleteBill($id);
        return redirect()->back()->with('success', 'Tagihan dihapus.');
    }
}
