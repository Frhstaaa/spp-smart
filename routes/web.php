<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Academic\Controllers\AngkatanController;
use Modules\Core\Controllers\DashboardController;
use Modules\Academic\Controllers\SchoolClassController;
use Modules\Academic\Controllers\StudentController;
use Modules\Finance\Controllers\TariffController;
use Modules\Finance\Controllers\BillController;
use Modules\Finance\Controllers\PaymentController;
use Modules\Finance\Controllers\ReportController;
use Modules\Core\Controllers\ProfileController;
use Modules\Core\Controllers\MonitoringController;
use Modules\Core\Controllers\UserController;
use Modules\Core\Controllers\SettingController;
use Modules\Core\Controllers\NotificationController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Tata Usaha routes
    Route::middleware(['role:tata_usaha'])->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('angkatans', AngkatanController::class);
        Route::resource('classes', SchoolClassController::class);
        Route::resource('students', StudentController::class);
        Route::resource('tariffs', TariffController::class);
        
        Route::get('/bills/generate', [BillController::class, 'createAuto'])->name('bills.createAuto');
        Route::post('/bills/generate', [BillController::class, 'storeAuto'])->name('bills.storeAuto');
        Route::resource('bills', BillController::class);
        
        Route::get('/payments/cash', [PaymentController::class, 'cashIndex'])->name('payments.cashIndex');
        Route::post('/payments/cash', [PaymentController::class, 'cashStore'])->name('payments.cashStore');
        
        Route::get('/payments/pending', [PaymentController::class, 'pendingIndex'])->name('payments.pending');
        Route::post('/payments/{payment}/approve', [PaymentController::class, 'approve'])->name('payments.approve');
        Route::post('/payments/{payment}/reject', [PaymentController::class, 'reject'])->name('payments.reject');
        
        Route::get('/payments/{payment}/receipt', [PaymentController::class, 'printReceipt'])->name('payments.receipt');
        Route::get('/payments/{payment}/receipt/pdf', [PaymentController::class, 'downloadReceiptPdf'])->name('payments.receipt.pdf');
        Route::get('/students/{student}/ledger/pdf', [StudentController::class, 'downloadLedgerPdfAdmin'])->name('students.ledger.pdf');
        
        Route::resource('expenses', \Modules\Finance\Controllers\ExpenseController::class)->except(['create', 'show', 'edit']);
        
        Route::get('/audit-logs', [\Modules\Core\Controllers\AuditLogController::class, 'index'])->name('audit-logs.index');
        
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        
        Route::get('/monitoring', [MonitoringController::class, 'index'])->name('monitoring.index');
        
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    });

    // Siswa routes
    Route::middleware(['role:siswa'])->group(function () {
        Route::get('/my-bills', [BillController::class, 'myBills'])->name('siswa.bills');
        Route::get('/my-bills/pay', [PaymentController::class, 'paySelection'])->name('siswa.paySelection');
        Route::post('/my-bills/pay-multiple', [PaymentController::class, 'payMultiple'])->name('siswa.payMultiple');
        Route::post('/my-bills/pay-advance', [PaymentController::class, 'payAdvance'])->name('siswa.payAdvance');
        Route::post('/my-bills/{bill}/pay', [PaymentController::class, 'payDigital'])->name('siswa.pay');
        Route::post('/my-bills/{bill}/discount', [BillController::class, 'requestDiscount'])->name('siswa.requestDiscount');
        Route::get('/my-payments', [PaymentController::class, 'myPayments'])->name('siswa.payments');
        Route::get('/my-payments/{payment}/receipt', [PaymentController::class, 'printReceipt'])->name('siswa.receipt');
        Route::get('/my-payments/{payment}/receipt/pdf', [PaymentController::class, 'downloadReceiptPdf'])->name('siswa.receipt.pdf');
        Route::get('/my-ledger/pdf', [StudentController::class, 'downloadLedgerPdfSiswa'])->name('siswa.ledger.pdf');
    });

    // Yayasan / Kepsek routes
    Route::middleware(['role:yayasan'])->group(function () {
        Route::get('/executive/dashboard', [DashboardController::class, 'executive'])->name('executive.dashboard');
        Route::get('/executive/discounts', [BillController::class, 'discounts'])->name('executive.discounts');
        Route::post('/executive/discounts/{id}/approve', [BillController::class, 'approveDiscount'])->name('executive.discounts.approve');
    });

    // Profile (All Roles)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::post('/profile/info', [ProfileController::class, 'updateInfo'])->name('profile.info');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications (All Roles)
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
});

require __DIR__.'/auth.php';
