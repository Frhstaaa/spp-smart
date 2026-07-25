<?php

namespace Modules\Finance\Interfaces;

interface PaymentRepositoryInterface
{
    public function getPendingBills($search = null);
    public function createCashPayment(array $data);
    public function createDigitalPayment($billId);
    public function createAdvancePayment(array $data, $studentId);
    public function createMultiplePayments(array $monthsData, $studentId);
    public function getStudentBillsForPayment($studentId);
    public function getStudentPayments($studentId);
    public function getPaymentById($paymentId);
    public function getPendingPayments();
    public function approvePayment($paymentId);
    public function rejectPayment($paymentId);
}
