<?php

namespace Modules\Academic\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Academic\Interfaces\AngkatanRepositoryInterface;
use Inertia\Inertia;

class AngkatanController extends Controller
{
    protected $angkatanRepo;

    public function __construct(AngkatanRepositoryInterface $angkatanRepo)
    {
        $this->angkatanRepo = $angkatanRepo;
    }

    public function index()
    {
        $angkatans = $this->angkatanRepo->getAll();
        return Inertia::render('Angkatans/Index', [
            'angkatans' => $angkatans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'nullable|string|max:10'
        ]);

        $this->angkatanRepo->create($validated);

        return redirect()->back()->with('success', 'Data Angkatan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'nullable|string|max:10'
        ]);

        $this->angkatanRepo->update($id, $validated);

        return redirect()->back()->with('success', 'Data Angkatan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->angkatanRepo->delete($id);

        return redirect()->back()->with('success', 'Data Angkatan berhasil dihapus.');
    }
}
