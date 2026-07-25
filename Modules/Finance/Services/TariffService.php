<?php

namespace Modules\Finance\Services;

use Modules\Finance\Interfaces\TariffRepositoryInterface;

class TariffService
{
    protected $tariffRepo;

    public function __construct(TariffRepositoryInterface $tariffRepo)
    {
        $this->tariffRepo = $tariffRepo;
    }

    public function getAllWithAngkatan()
    {
        return $this->tariffRepo->getAllWithAngkatan();
    }

    public function findById($id)
    {
        return $this->tariffRepo->findById($id);
    }

    public function createTariff(array $data)
    {
        return $this->tariffRepo->create($data);
    }

    public function updateTariff($id, array $data)
    {
        return $this->tariffRepo->update($id, $data);
    }

    public function deleteTariff($id)
    {
        return $this->tariffRepo->delete($id);
    }
}
