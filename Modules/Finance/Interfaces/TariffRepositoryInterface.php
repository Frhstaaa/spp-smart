<?php

namespace Modules\Finance\Interfaces;

interface TariffRepositoryInterface
{
    public function getAllWithAngkatan();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
