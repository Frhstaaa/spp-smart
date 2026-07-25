<?php

namespace Modules\Core\Interfaces;

interface ProfileRepositoryInterface
{
    public function updateInfo($user, array $data);
    public function updatePhoto($user, $photoData);
    public function deleteAccount($user);
}
