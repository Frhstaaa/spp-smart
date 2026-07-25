<?php

namespace Modules\Finance\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Finance\Interfaces\BillRepositoryInterface;
use Modules\Finance\Repositories\BillRepository;
use Modules\Finance\Interfaces\PaymentRepositoryInterface;
use Modules\Finance\Repositories\PaymentRepository;
use Modules\Finance\Interfaces\TariffRepositoryInterface;
use Modules\Finance\Repositories\TariffRepository;
use Modules\Finance\Interfaces\ReportRepositoryInterface;
use Modules\Finance\Repositories\ReportRepository;

class FinanceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(BillRepositoryInterface::class, BillRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(TariffRepositoryInterface::class, TariffRepository::class);
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        $this->app->bind(\Modules\Finance\Interfaces\ExpenseRepositoryInterface::class, \Modules\Finance\Repositories\ExpenseRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Add boot logic here if necessary
    }
}
