<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Core\Interfaces\ProfileRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    protected $profileRepo;

    public function __construct(ProfileRepositoryInterface $profileRepo)
    {
        $this->profileRepo = $profileRepo;
    }

    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'user' => $request->user()
        ]);
    }

    public function updateInfo(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $this->profileRepo->updateInfo($request->user(), $validated);
        
        return back()->with('success', 'Profile updated');
    }

    public function updatePhoto(Request $request)
    {
        $this->profileRepo->updatePhoto($request->user(), $request->all());
        return back();
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $this->profileRepo->deleteAccount($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
