<?php

namespace Tests\Unit\Finance;

use Tests\TestCase;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\User;
use App\Models\Student;
use App\Models\Tariff;
use App\Models\Angkatan;
use App\Models\SchoolClass;
use Modules\Finance\Repositories\PaymentRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $paymentRepo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->paymentRepo = new PaymentRepository();
    }

    public function test_can_approve_pending_payment()
    {
        // 1. Setup Data
        $angkatan = Angkatan::create(['name' => 'Angkatan 2023', 'year' => '2023']);
        $class = SchoolClass::create(['name' => '10A', 'level' => 'SMA']);
        $user = User::factory()->create(['role' => 'siswa']);
        $student = Student::create([
            'user_id' => $user->id,
            'school_class_id' => $class->id,
            'angkatan_id' => $angkatan->id,
            'name' => 'John Doe',
            'nis' => '12345',
            'nisn' => '1234567890',
            'gender' => 'L',
            'is_active' => true
        ]);
        
        $tariff = Tariff::create([
            'name' => 'SPP Bulanan',
            'amount' => 500000,
            'type' => 'spp',
            'angkatan_id' => $angkatan->id
        ]);
        
        $bill = Bill::create([
            'student_id' => $student->id,
            'tariff_id' => $tariff->id,
            'month' => 7,
            'year' => 2023,
            'amount' => 500000,
            'due_date' => now()->addDays(5),
            'status' => 'unpaid'
        ]);
        
        $payment = Payment::create([
            'bill_id' => $bill->id,
            'payment_date' => now(),
            'amount' => 500000,
            'method' => 'qris',
            'status' => 'pending',
            'transaction_id' => 'TRX-123'
        ]);

        // 2. Action
        $result = $this->paymentRepo->approvePayment($payment->id);

        // 3. Assert
        $this->assertTrue($result);
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'success'
        ]);
        $this->assertDatabaseHas('bills', [
            'id' => $bill->id,
            'status' => 'paid'
        ]);
    }

    public function test_cannot_approve_already_approved_payment()
    {
        // 1. Setup Data
        $angkatan = Angkatan::create(['name' => 'Angkatan 2023', 'year' => '2023']);
        $class = SchoolClass::create(['name' => '10A', 'level' => 'SMA']);
        $user = User::factory()->create(['role' => 'siswa']);
        $student = Student::create([
            'user_id' => $user->id,
            'school_class_id' => $class->id,
            'angkatan_id' => $angkatan->id,
            'name' => 'John Doe',
            'nis' => '12345',
            'gender' => 'L',
            'is_active' => true
        ]);
        
        $tariff = Tariff::create(['name' => 'SPP', 'amount' => 500000, 'type' => 'spp']);
        $bill = Bill::create([
            'student_id' => $student->id,
            'tariff_id' => $tariff->id,
            'month' => 7,
            'year' => 2023,
            'amount' => 500000,
            'status' => 'paid'
        ]);
        $payment = Payment::create([
            'bill_id' => $bill->id,
            'payment_date' => now(),
            'amount' => 500000,
            'method' => 'qris',
            'status' => 'success', // Already approved
            'transaction_id' => 'TRX-456'
        ]);

        // 2. Action
        $result = $this->paymentRepo->approvePayment($payment->id);

        // 3. Assert
        $this->assertFalse($result); // Should return false
    }
}
