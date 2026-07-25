<?php

namespace Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Finance\Interfaces\ExpenseRepositoryInterface;

class ExpenseController extends Controller
{
    protected $expenseRepo;

    public function __construct(ExpenseRepositoryInterface $expenseRepo)
    {
        $this->expenseRepo = $expenseRepo;
    }

    public function index()
    {
        $expenses = $this->expenseRepo->getAll();
        
        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string'
        ]);

        $validated['user_id'] = auth()->id();

        $this->expenseRepo->create($validated);

        return redirect()->route('expenses.index')->with('success', 'Pengeluaran berhasil dicatat.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string'
        ]);

        $this->expenseRepo->update($id, $validated);

        return redirect()->route('expenses.index')->with('success', 'Data pengeluaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->expenseRepo->delete($id);

        return redirect()->route('expenses.index')->with('success', 'Data pengeluaran berhasil dihapus.');
    }
}
