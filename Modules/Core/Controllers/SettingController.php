<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Core\Interfaces\SettingRepositoryInterface;

class SettingController extends Controller
{
    protected $settingRepo;

    public function __construct(SettingRepositoryInterface $settingRepo)
    {
        $this->settingRepo = $settingRepo;
    }

    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => $this->settingRepo->getAllSettings()
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:50',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'school_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
            'dashboard_avatar' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
            'dashboard_avatar_2' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
            'auto_generate_bill' => 'nullable|boolean',
            'auto_generate_date' => 'nullable|integer|min:1|max:28',
            'app_theme' => 'nullable|string|in:indigo,blue,teal,emerald,rose',
            'dashboard_header_color_from' => 'nullable|string|max:20',
            'dashboard_header_color_to' => 'nullable|string|max:20'
        ]);

        if ($request->hasFile('school_logo')) {
            $path = $request->file('school_logo')->store('logos', 'public');
            $validated['school_logo'] = $path;
        } else {
            unset($validated['school_logo']);
        }

        if ($request->hasFile('dashboard_avatar')) {
            $path = $request->file('dashboard_avatar')->store('logos', 'public');
            $validated['dashboard_avatar'] = $path;
        } else {
            unset($validated['dashboard_avatar']);
        }

        if ($request->hasFile('dashboard_avatar_2')) {
            $path = $request->file('dashboard_avatar_2')->store('logos', 'public');
            $validated['dashboard_avatar_2'] = $path;
        } else {
            unset($validated['dashboard_avatar_2']);
        }

        $this->settingRepo->saveSettings($validated);

        return redirect()->route('settings.index')->with('success', 'Pengaturan berhasil disimpan.');
    }
}
