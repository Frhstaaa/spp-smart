<?php

namespace Modules\Finance\Services;

use App\Models\Student;
use App\Models\Tariff;
use Illuminate\Support\Facades\DB;
use Modules\Finance\Interfaces\BillRepositoryInterface;

class BillService
{
    protected $billRepo;

    public function __construct(BillRepositoryInterface $billRepo)
    {
        $this->billRepo = $billRepo;
    }

    public function generateAutoBills(array $data)
    {
        $tariff = Tariff::findOrFail($data['tariff_id']);
        
        $studentsQuery = Student::where('is_active', true);
        
        if (!empty($data['student_ids']) && count($data['student_ids']) > 0) {
            $studentsQuery->whereIn('id', $data['student_ids']);
        } else if (!empty($data['class_id'])) {
            $studentsQuery->where('school_class_id', $data['class_id']);
        } else if (!empty($data['level'])) {
            $studentsQuery->whereHas('schoolClass', function($q) use ($data) {
                $q->where('level', $data['level']);
            });
        } else if (!empty($tariff->level_applied)) {
            $studentsQuery->whereHas('schoolClass', function($q) use ($tariff) {
                $q->where('level', $tariff->level_applied);
            });
        }
        
        $students = $studentsQuery->get();
        $generatedCount = 0;
        
        $monthsToGenerate = !empty($data['generate_12_months']) ? 12 : 1;

        DB::transaction(function () use ($students, $tariff, $data, &$generatedCount, $monthsToGenerate) {
            foreach ($students as $student) {
                $currentMonth = (int)$data['month'];
                $currentYear = (int)$data['year'];
                $currentDueDate = \Carbon\Carbon::parse($data['due_date']);
                $notifiedForThisStudent = false;

                for ($i = 0; $i < $monthsToGenerate; $i++) {
                    $exists = $this->billRepo->checkBillExists($student->id, $tariff->id, $currentMonth, $currentYear);

                    if (!$exists) {
                        $bill = $this->billRepo->create([
                            'student_id' => $student->id,
                            'tariff_id' => $tariff->id,
                            'month' => $currentMonth,
                            'year' => $currentYear,
                            'amount' => $tariff->amount,
                            'due_date' => $currentDueDate->format('Y-m-d'),
                            'status' => 'pending'
                        ]);
                        
                        if (!$notifiedForThisStudent) {
                            if ($student->user) {
                                $student->user->notify(new \App\Notifications\NewBillNotification($bill));
                            }
                            
                            app(\App\Services\WhatsAppService::class)->sendNewBill($bill);
                            $notifiedForThisStudent = true;
                        }
                        
                        $generatedCount++;
                    }

                    $currentMonth++;
                    if ($currentMonth > 12) {
                        $currentMonth = 1;
                        $currentYear++;
                    }
                    $currentDueDate->addMonth();
                }
            }
        });

        return $generatedCount;
    }

    public function submitDiscountRequest(int $billId, int $studentId, array $data)
    {
        $bill = $this->billRepo->findById($billId);
        
        if ($bill->student_id !== $studentId) {
            throw new \Exception("Unauthorized", 403);
        }

        if ($this->billRepo->hasPendingDiscountRequest($billId)) {
            throw new \Exception("Anda sudah memiliki pengajuan keringanan yang sedang diproses untuk tagihan ini.");
        }

        return $this->billRepo->createDiscountRequest([
            'student_id' => $studentId,
            'bill_id' => $billId,
            'discount_amount' => $data['discount_amount'],
            'reason' => $data['reason'],
            'status' => 'pending'
        ]);
    }

    public function updateDiscountStatus(int $discountRequestId, string $status, int $approvedById)
    {
        $discountRequest = $this->billRepo->findDiscountRequestById($discountRequestId);
        
        $discountRequest = $this->billRepo->updateDiscountRequest($discountRequestId, [
            'status' => $status,
            'approved_by' => $approvedById,
        ]);
        
        if ($discountRequest->student && $discountRequest->student->user) {
            $discountRequest->student->user->notify(new \App\Notifications\DiscountStatusNotification($discountRequest));
        }

        return $discountRequest;
    }
}
