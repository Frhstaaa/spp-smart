<?php

namespace Modules\Finance\Interfaces;

interface PaymentRepositoryInterface
{
    public function getPendingBills($search = null);
    public function getStudentBillsForPayment($studentId);
    public function getStudentPayments($studentId);
    public function getPaymentById($paymentId);
    public function getPendingPayments();
    
    // Core data access methods
    public function createPayment(array $data);
    public function updatePayment(int $paymentId, array $data);
    public function getBillById(int $billId);
    public function updateBill(int $billId, array $data);
    public function findPendingPaymentForBill(int $billId);
    public function firstOrCreateBill(array $attributes, array $values);
}
