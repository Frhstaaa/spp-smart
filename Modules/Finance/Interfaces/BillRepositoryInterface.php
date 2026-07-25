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
     * Generate auto bills based on validated request data.
     */
    public function generateAutoBills(array $data);

    /**
     * Submit a discount request for a bill.
     */
    public function submitDiscountRequest(int $billId, int $studentId, array $data);

    /**
     * Approve or reject a discount request.
     */
    public function updateDiscountStatus(int $discountRequestId, string $status, int $approvedById);
    
    /**
     * Delete a bill by ID.
     */
    public function deleteBill(int $id);
}
