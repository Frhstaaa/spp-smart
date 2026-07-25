<?php

namespace Modules\Core\Interfaces;

interface SettingRepositoryInterface
{
    public function getAllSettings();
    public function saveSettings(array $data);
}
