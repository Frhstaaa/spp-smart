<?php

use App\Providers\AppServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    Modules\Finance\Providers\FinanceServiceProvider::class,
    Modules\Academic\Providers\AcademicServiceProvider::class,
    Modules\Core\Providers\CoreServiceProvider::class,
];
