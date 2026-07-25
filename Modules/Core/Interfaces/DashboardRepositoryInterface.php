<?php

namespace Modules\Core\Interfaces;

interface DashboardRepositoryInterface
{
    public function getAdminMetrics();
    public function getStudentMetrics($student);
    public function getExecutiveMetrics();
}
