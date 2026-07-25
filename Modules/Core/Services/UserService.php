<?php

namespace Modules\Core\Services;

use Illuminate\Support\Facades\Hash;
use Modules\Core\Interfaces\UserRepositoryInterface;

class UserService
{
    protected $userRepo;

    public function __construct(UserRepositoryInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function getAllUsers($search = null, $role = 'all')
    {
        return $this->userRepo->getAllUsers($search, $role);
    }

    public function findById($id)
    {
        return $this->userRepo->findById($id);
    }

    public function createUser(array $data)
    {
        // Logic specific to user creation
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->userRepo->create($data);
    }

    public function updateUser($id, array $data)
    {
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        return $this->userRepo->update($id, $data);
    }

    public function deleteUser($id)
    {
        return $this->userRepo->delete($id);
    }
}
