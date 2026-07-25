<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Tariff;
use App\Models\Bill;
use App\Notifications\NewBillNotification;

class GenerateMonthlyBills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bills:auto-generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly bills based on settings and student yearly payment status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $autoGenerate = Setting::where('key', 'auto_generate_bill')->value('value');
        if ($autoGenerate !== '1' && $autoGenerate !== 'true') {
            $this->info('Auto generation is disabled in settings.');
            return;
        }

        $globalTargetDate = Setting::where('key', 'auto_generate_date')->value('value');
        if (!$globalTargetDate) {
            $globalTargetDate = 1; // default to 1st of month if not set
        }

        $todayDate = (int)date('j');

        $currentMonth = date('n');
        $currentYear = date('Y');
        // If due_date is usually end of month, we can set due_date as end of current month
        $dueDate = date('Y-m-t'); 

        // Fetch all SPP tariffs to avoid N+1 query
        $sppTariffs = Tariff::where('type', 'spp')->get();
        $defaultSppTariff = $sppTariffs->whereNull('angkatan_id')->first();

        // Get all active students who haven't paid yearly
        $students = Student::with(['user'])
            ->where('is_active', true)
            ->where('is_paid_yearly', false)
            ->get();

        $generatedCount = 0;

        foreach ($students as $student) {
            $sppTariff = $sppTariffs->where('angkatan_id', $student->angkatan_id)->first() ?? $defaultSppTariff;
            
            if (!$sppTariff) continue;

            $studentTargetDate = $sppTariff->auto_generate_date ?? $globalTargetDate;
            if ($todayDate !== (int)$studentTargetDate) {
                continue;
            }

            // Avoid duplicates
            $exists = Bill::where('student_id', $student->id)
                ->where('tariff_id', $sppTariff->id)
                ->where('month', $currentMonth)
                ->where('year', $currentYear)
                ->exists();

            if (!$exists) {
                $bill = Bill::create([
                    'student_id' => $student->id,
                    'tariff_id' => $sppTariff->id,
                    'month' => $currentMonth,
                    'year' => $currentYear,
                    'amount' => $sppTariff->amount,
                    'due_date' => $dueDate,
                    'status' => 'pending'
                ]);

                if ($student->user) {
                    $student->user->notify(new NewBillNotification($bill));
                }

                $generatedCount++;
            }
        }

        $this->info("Successfully generated {$generatedCount} bills.");
    }
}
