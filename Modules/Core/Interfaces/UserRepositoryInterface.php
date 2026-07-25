<?php

namespace Modules\Core\Interfaces;

interface UserRepositoryInterface
{
    public function getAllUsers($search = null, $role = 'all');
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
