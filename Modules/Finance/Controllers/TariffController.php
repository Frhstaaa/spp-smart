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
    protected $tariffService;

    public function __construct(TariffRepositoryInterface $tariffRepo, \Modules\Finance\Services\TariffService $tariffService)
    {
        $this->tariffRepo = $tariffRepo;
        $this->tariffService = $tariffService;
    }

    public function index()
    {
        return Inertia::render('Tariffs/Index', [
            'tariffs' => $this->tariffService->getAllWithAngkatan(),
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

        $this->tariffService->createTariff($validated);

        return redirect()->route('tariffs.index')->with('success', 'Tarif berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Tariffs/Edit', [
            'tariff' => $this->tariffService->findById($id)
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

        $this->tariffService->updateTariff($id, $validated);

        return redirect()->route('tariffs.index')->with('success', 'Data Tarif berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->tariffService->deleteTariff($id);
        return redirect()->route('tariffs.index')->with('success', 'Tarif berhasil dihapus.');
    }
}
