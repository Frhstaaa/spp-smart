<?php

namespace Modules\Academic\Repositories;

use App\Models\Angkatan;
use Modules\Academic\Interfaces\AngkatanRepositoryInterface;

class AngkatanRepository implements AngkatanRepositoryInterface
{
    public function getAll()
    {
        return Angkatan::latest()->get();
    }

    public function findById($id)
    {
        return Angkatan::findOrFail($id);
    }

    public function create(array $data)
    {
        return Angkatan::create($data);
    }

    public function update($id, array $data)
    {
        $angkatan = $this->findById($id);
        $angkatan->update($data);
        return $angkatan;
    }

    public function delete($id)
    {
        $angkatan = $this->findById($id);
        return $angkatan->delete();
    }
}
