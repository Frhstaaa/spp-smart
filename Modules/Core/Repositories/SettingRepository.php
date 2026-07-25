<?php

namespace Modules\Core\Repositories;

use App\Models\Setting;
use Modules\Core\Interfaces\SettingRepositoryInterface;

class SettingRepository implements SettingRepositoryInterface
{
    public function getAllSettings()
    {
        return Setting::pluck('value', 'key')->toArray();
    }

    public function saveSettings(array $data)
    {
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
