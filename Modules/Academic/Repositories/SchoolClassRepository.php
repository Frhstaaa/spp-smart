<?php

namespace Modules\Academic\Repositories;

use App\Models\SchoolClass;
use Modules\Academic\Interfaces\SchoolClassRepositoryInterface;

class SchoolClassRepository implements SchoolClassRepositoryInterface
{
    public function getAll()
    {
        return SchoolClass::orderBy('level', 'desc')->orderBy('name', 'asc')->get();
    }

    public function findById($id)
    {
        return SchoolClass::findOrFail($id);
    }

    public function create(array $data)
    {
        return SchoolClass::create($data);
    }

    public function update($id, array $data)
    {
        $class = $this->findById($id);
        $class->update($data);
        return $class;
    }

    public function delete($id)
    {
        $class = $this->findById($id);
        return $class->delete();
    }
}
