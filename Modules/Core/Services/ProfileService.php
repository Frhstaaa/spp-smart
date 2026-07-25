<?php

namespace Modules\Core\Services;

use Modules\Core\Interfaces\ProfileRepositoryInterface;

class ProfileService
{
    protected $profileRepo;

    public function __construct(ProfileRepositoryInterface $profileRepo)
    {
        $this->profileRepo = $profileRepo;
    }

    public function updateInfo($user, array $data)
    {
        return $this->profileRepo->updateInfo($user, $data);
    }

    public function updatePhoto($user, array $data)
    {
        return $this->profileRepo->updatePhoto($user, $data);
    }

    public function deleteAccount($user)
    {
        return $this->profileRepo->deleteAccount($user);
    }
}
