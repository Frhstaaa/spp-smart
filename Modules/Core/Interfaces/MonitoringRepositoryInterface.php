<?php

namespace Modules\Core\Interfaces;

interface MonitoringRepositoryInterface
{
    public function getStudentMonitoringData($year, $classId = 'all', $angkatanId = 'all', $search = '');
}
