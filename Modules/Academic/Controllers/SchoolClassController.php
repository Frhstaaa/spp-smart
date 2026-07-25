<?php

namespace Modules\Academic\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Academic\Interfaces\SchoolClassRepositoryInterface;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    protected $classRepo;

    public function __construct(SchoolClassRepositoryInterface $classRepo)
    {
        $this->classRepo = $classRepo;
    }

    public function index()
    {
        return Inertia::render('Classes/Index', [
            'classes' => $this->classRepo->getAll()
        ]);
    }

    public function create()
    {
        return Inertia::render('Classes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255'
        ]);

        $this->classRepo->create($validated);

        return redirect()->route('classes.index')->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $class = $this->classRepo->findById($id);
        return Inertia::render('Classes/Edit', [
            'schoolClass' => $class
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255'
        ]);

        $this->classRepo->update($id, $validated);

        return redirect()->route('classes.index')->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->classRepo->delete($id);
        return redirect()->route('classes.index')->with('success', 'Kelas berhasil dihapus.');
    }
}
