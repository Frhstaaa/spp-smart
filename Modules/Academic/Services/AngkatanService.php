<?php

namespace Modules\Academic\Services;

use Modules\Academic\Interfaces\AngkatanRepositoryInterface;

class AngkatanService
{
    protected $angkatanRepo;

    public function __construct(AngkatanRepositoryInterface $angkatanRepo)
    {
        $this->angkatanRepo = $angkatanRepo;
    }

    public function getAll()
    {
        return $this->angkatanRepo->getAll();
    }

    public function findById($id)
    {
        return $this->angkatanRepo->findById($id);
    }

    public function createAngkatan(array $data)
    {
        return $this->angkatanRepo->create($data);
    }

    public function updateAngkatan($id, array $data)
    {
        return $this->angkatanRepo->update($id, $data);
    }

    public function deleteAngkatan($id)
    {
        return $this->angkatanRepo->delete($id);
    }
}
