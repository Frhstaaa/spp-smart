<?php

namespace Modules\Academic\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Academic\Interfaces\StudentRepositoryInterface;
use Modules\Academic\Interfaces\SchoolClassRepositoryInterface;
use Modules\Academic\Interfaces\AngkatanRepositoryInterface;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected $studentRepo;
    protected $studentService;
    protected $classRepo;
    protected $angkatanRepo;

    public function __construct(
        StudentRepositoryInterface $studentRepo,
        \Modules\Academic\Services\StudentService $studentService,
        SchoolClassRepositoryInterface $classRepo,
        AngkatanRepositoryInterface $angkatanRepo
    ) {
        $this->studentRepo = $studentRepo;
        $this->studentService = $studentService;
        $this->classRepo = $classRepo;
        $this->angkatanRepo = $angkatanRepo;
    }

    public function index(Request $request)
    {
        return Inertia::render('Students/Index', [
            'students' => $this->studentRepo->getAll($request->all()),
            'filters' => $request->only(['search', 'class_id']),
            'classes' => $this->classRepo->getAll()
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/Create', [
            'classes' => $this->classRepo->getAll(),
            'angkatans' => $this->angkatanRepo->getAll()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis|max:20',
            'nik' => 'nullable|string|unique:students,nik|max:20',
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:L,P',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'class_id' => 'required|exists:school_classes,id',
            'angkatan_id' => 'nullable|exists:angkatans,id',
            'email' => 'nullable|email|unique:users,email',
            
            'address' => 'nullable|string',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'parent_job' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_paid_yearly' => 'nullable|boolean',
        ]);

        $this->studentService->createStudent($validated);

        return redirect()->route('students.index')->with('success', 'Siswa berhasil ditambahkan. (Password default akun adalah NIS)');
    }

    public function edit($id)
    {
        $student = $this->studentRepo->findById($id);

        return Inertia::render('Students/Edit', [
            'student' => $student,
            'classes' => $this->classRepo->getAll(),
            'angkatans' => $this->angkatanRepo->getAll()
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:students,nis,' . $id,
            'nik' => 'nullable|string|max:20|unique:students,nik,' . $id,
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:L,P',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'class_id' => 'required|exists:school_classes,id',
            'angkatan_id' => 'nullable|exists:angkatans,id',
            
            'address' => 'nullable|string',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'parent_job' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_paid_yearly' => 'nullable|boolean',
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        $this->studentService->updateStudent($id, $validated);

        return redirect()->route('students.index')->with('success', 'Data Siswa berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->studentService->deleteStudent($id);

        return redirect()->route('students.index')->with('success', 'Data Siswa berhasil dihapus.');
    }

    public function downloadLedgerPdfAdmin($id)
    {
        $student = $this->studentRepo->findById($id);
        $bills = \App\Models\Bill::where('student_id', $id)->with(['tariff', 'payments'])->orderBy('year')->orderBy('month')->get();
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.ledger', compact('student', 'bills', 'settings'));
        $pdf->setPaper('a4', 'portrait');
        
        return $pdf->download('Rapor_Keuangan_' . $student->nis . '.pdf');
    }

    public function downloadLedgerPdfSiswa()
    {
        $student = auth()->user()->student;
        $bills = \App\Models\Bill::where('student_id', $student->id)->with(['tariff', 'payments'])->orderBy('year')->orderBy('month')->get();
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.ledger', compact('student', 'bills', 'settings'));
        $pdf->setPaper('a4', 'portrait');
        
        return $pdf->download('Rapor_Keuangan_' . $student->nis . '.pdf');
    }
}
