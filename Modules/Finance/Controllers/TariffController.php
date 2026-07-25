<?php

namespace Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Finance\Interfaces\TariffRepositoryInterface;
use App\Models\Angkatan;

class TariffController extends Controller
{
    protected $tariffRepo;

    public function __construct(TariffRepositoryInterface $tariffRepo)
    {
        $this->tariffRepo = $tariffRepo;
    }

    public function index()
    {
        return Inertia::render('Tariffs/Index', [
            'tariffs' => $this->tariffRepo->getAllWithAngkatan(),
            'angkatans' => Angkatan::orderBy('year', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Tariffs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|string|max:50',
            'angkatan_id' => 'nullable|exists:angkatans,id',
            'auto_generate_date' => 'nullable|integer|min:1|max:28'
        ]);

        $this->tariffRepo->create($validated);

        return redirect()->route('tariffs.index')->with('success', 'Tarif berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Tariffs/Edit', [
            'tariff' => $this->tariffRepo->findById($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|string|max:50',
            'angkatan_id' => 'nullable|exists:angkatans,id',
            'auto_generate_date' => 'nullable|integer|min:1|max:28'
        ]);

        $this->tariffRepo->update($id, $validated);

        return redirect()->route('tariffs.index')->with('success', 'Data Tarif berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->tariffRepo->delete($id);
        return redirect()->route('tariffs.index')->with('success', 'Tarif berhasil dihapus.');
    }
}
