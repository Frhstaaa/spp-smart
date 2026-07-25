<?php

namespace Modules\Finance\Services;

use Modules\Finance\Interfaces\ExpenseRepositoryInterface;

class ExpenseService
{
    protected $expenseRepo;

    public function __construct(ExpenseRepositoryInterface $expenseRepo)
    {
        $this->expenseRepo = $expenseRepo;
    }

    public function getAll()
    {
        return $this->expenseRepo->getAll();
    }

    public function findById($id)
    {
        return $this->expenseRepo->findById($id);
    }

    public function createExpense(array $data)
    {
        $data['user_id'] = auth()->id();
        return $this->expenseRepo->create($data);
    }

    public function updateExpense($id, array $data)
    {
        return $this->expenseRepo->update($id, $data);
    }

    public function deleteExpense($id)
    {
        return $this->expenseRepo->delete($id);
    }

    public function getTotalExpenses()
    {
        return $this->expenseRepo->getTotalExpenses();
    }
}
