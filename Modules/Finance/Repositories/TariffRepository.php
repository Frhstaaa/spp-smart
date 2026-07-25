<?php

namespace Modules\Finance\Repositories;

use App\Models\Tariff;
use Modules\Finance\Interfaces\TariffRepositoryInterface;

class TariffRepository implements TariffRepositoryInterface
{
    public function getAllWithAngkatan()
    {
        return Tariff::with('angkatan')->orderBy('name', 'asc')->get();
    }

    public function findById($id)
    {
        return Tariff::findOrFail($id);
    }

    public function create(array $data)
    {
        return Tariff::create($data);
    }

    public function update($id, array $data)
    {
        $tariff = $this->findById($id);
        $tariff->update($data);
        return $tariff;
    }

    public function delete($id)
    {
        $tariff = $this->findById($id);
        return $tariff->delete();
    }
}
