<?php

namespace Modules\Finance\Interfaces;

interface BillRepositoryInterface
{
    /**
     * Get all bills with relations for admin view.
     */
    public function getAllBills();

    /**
     * Get bills specifically for a student.
     */
    public function getStudentBills($studentId);

    /**
     * Find a bill by ID.
     */
    public function findById(int $id);

    /**
     * Create a new bill.
     */
    public function create(array $data);

    /**
     * Check if a bill exists for a student, tariff, month, year.
     */
    public function checkBillExists(int $studentId, int $tariffId, int $month, int $year): bool;

    /**
     * Delete a bill by ID.
     */
    public function deleteBill(int $id);

    /**
     * Check if a pending discount request exists for a bill.
     */
    public function hasPendingDiscountRequest(int $billId): bool;

    /**
     * Create a new discount request.
     */
    public function createDiscountRequest(array $data);

    /**
     * Find a discount request by ID.
     */
    public function findDiscountRequestById(int $id);

    /**
     * Update a discount request.
     */
    public function updateDiscountRequest(int $id, array $data);
}
