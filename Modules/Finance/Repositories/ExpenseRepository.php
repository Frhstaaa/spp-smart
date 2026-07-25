<?php

namespace Modules\Finance\Repositories;

use App\Models\Expense;
use Modules\Finance\Interfaces\ExpenseRepositoryInterface;

class ExpenseRepository implements ExpenseRepositoryInterface
{
    public function getAll()
    {
        return Expense::with('user')->orderBy('expense_date', 'desc')->get();
    }

    public function findById($id)
    {
        return Expense::with('user')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Expense::create($data);
    }

    public function update($id, array $data)
    {
        $expense = Expense::findOrFail($id);
        $expense->update($data);
        return $expense;
    }

    public function delete($id)
    {
        $expense = Expense::findOrFail($id);
        return $expense->delete();
    }

    public function getTotalExpenses()
    {
        return Expense::sum('amount');
    }
}
