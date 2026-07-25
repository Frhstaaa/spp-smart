<?php

namespace Modules\Core\Interfaces;

interface DashboardRepositoryInterface
{
    public function getBillsCount($month, $year, $status = null);
    public function getCashPaymentsToday();
    public function getRecentTransactions($limit = 5);
    public function getTotalExpenses($month = null, $year = null);
    public function getTotalIncome($month = null, $year = null);
    
    public function getStudentCurrentBill($studentId);
    public function getStudentRecentPayments($studentId, $limit = 5);
    public function getStudentBillsByTariff($studentId, $tariffId);
    
    public function getTotalArrears();
    public function getPendingDiscounts();
    public function getIncomeByMonth($month, $year);
}
