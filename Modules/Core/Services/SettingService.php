<?php

namespace Modules\Core\Services;

use Modules\Core\Interfaces\SettingRepositoryInterface;

class SettingService
{
    protected $settingRepo;

    public function __construct(SettingRepositoryInterface $settingRepo)
    {
        $this->settingRepo = $settingRepo;
    }

    public function getAllSettings()
    {
        return $this->settingRepo->getAllSettings();
    }

    public function saveSettings(array $data)
    {
        return $this->settingRepo->saveSettings($data);
    }
}
