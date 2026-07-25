<?php

namespace Modules\Academic\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Academic\Interfaces\StudentRepositoryInterface;
use Modules\Academic\Repositories\StudentRepository;
use Modules\Academic\Interfaces\SchoolClassRepositoryInterface;
use Modules\Academic\Repositories\SchoolClassRepository;
use Modules\Academic\Interfaces\AngkatanRepositoryInterface;
use Modules\Academic\Repositories\AngkatanRepository;

class AcademicServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(StudentRepositoryInterface::class, StudentRepository::class);
        $this->app->bind(SchoolClassRepositoryInterface::class, SchoolClassRepository::class);
        $this->app->bind(AngkatanRepositoryInterface::class, AngkatanRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
