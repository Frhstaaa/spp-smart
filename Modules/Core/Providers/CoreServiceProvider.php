<?php

namespace Modules\Core\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Core\Interfaces\UserRepositoryInterface;
use Modules\Core\Repositories\UserRepository;
use Modules\Core\Interfaces\SettingRepositoryInterface;
use Modules\Core\Repositories\SettingRepository;
use Modules\Core\Interfaces\DashboardRepositoryInterface;
use Modules\Core\Repositories\DashboardRepository;
use Modules\Core\Interfaces\MonitoringRepositoryInterface;
use Modules\Core\Repositories\MonitoringRepository;
use Modules\Core\Interfaces\NotificationRepositoryInterface;
use Modules\Core\Repositories\NotificationRepository;
use Modules\Core\Interfaces\ProfileRepositoryInterface;
use Modules\Core\Repositories\ProfileRepository;

class CoreServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(SettingRepositoryInterface::class, SettingRepository::class);
        $this->app->bind(DashboardRepositoryInterface::class, DashboardRepository::class);
        $this->app->bind(MonitoringRepositoryInterface::class, MonitoringRepository::class);
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->bind(ProfileRepositoryInterface::class, ProfileRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
