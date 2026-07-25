<?php

namespace Modules\Core\Repositories;

use Modules\Core\Interfaces\ProfileRepositoryInterface;

class ProfileRepository implements ProfileRepositoryInterface
{
    public function updateInfo($user, array $data)
    {
        $user->update([
            'name' => $data['name'],
            'phone_number' => $data['phone_number'] ?? null,
        ]);
        return $user;
    }

    public function updatePhoto($user, $photoData)
    {
        // Add logic for photo upload when needed
        return $user;
    }

    public function deleteAccount($user)
    {
        $user->delete();
    }
}
