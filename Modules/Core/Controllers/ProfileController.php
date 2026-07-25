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
    protected $profileService;

    public function __construct(ProfileRepositoryInterface $profileRepo, \Modules\Core\Services\ProfileService $profileService)
    {
        $this->profileRepo = $profileRepo;
        $this->profileService = $profileService;
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

        $this->profileService->updateInfo($request->user(), $validated);
        
        return back()->with('success', 'Profile updated');
    }

    public function updatePhoto(Request $request)
    {
        $this->profileService->updatePhoto($request->user(), $request->all());
        return back();
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $this->profileService->deleteAccount($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
