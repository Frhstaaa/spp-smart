<?php

namespace Modules\Academic\Services;

use Modules\Academic\Interfaces\SchoolClassRepositoryInterface;

class SchoolClassService
{
    protected $classRepo;

    public function __construct(SchoolClassRepositoryInterface $classRepo)
    {
        $this->classRepo = $classRepo;
    }

    public function getAll()
    {
        return $this->classRepo->getAll();
    }

    public function findById($id)
    {
        return $this->classRepo->findById($id);
    }

    public function createClass(array $data)
    {
        return $this->classRepo->create($data);
    }

    public function updateClass($id, array $data)
    {
        return $this->classRepo->update($id, $data);
    }

    public function deleteClass($id)
    {
        return $this->classRepo->delete($id);
    }
}
