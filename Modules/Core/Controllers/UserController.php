<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Core\Interfaces\UserRepositoryInterface;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $userRepo;

    public function __construct(UserRepositoryInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role', 'all');

        $users = $this->userRepo->getAllUsers($search, $role);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['tata_usaha', 'yayasan', 'siswa'])],
        ]);

        $this->userRepo->create($validated);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Users/Edit', [
            'user' => $this->userRepo->findById($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'role' => ['required', Rule::in(['tata_usaha', 'yayasan', 'siswa'])],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $this->userRepo->update($id, $validated);

        return redirect()->route('users.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (auth()->id() == $id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $this->userRepo->delete($id);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}
