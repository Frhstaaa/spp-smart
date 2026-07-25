<?php

namespace Modules\Core\Services;

use Modules\Core\Interfaces\MonitoringRepositoryInterface;

class MonitoringService
{
    protected $monitoringRepo;

    public function __construct(MonitoringRepositoryInterface $monitoringRepo)
    {
        $this->monitoringRepo = $monitoringRepo;
    }

    public function getStudentMonitoringData($year, $classId, $angkatanId, $search)
    {
        return $this->monitoringRepo->getStudentMonitoringData($year, $classId, $angkatanId, $search);
    }
}
