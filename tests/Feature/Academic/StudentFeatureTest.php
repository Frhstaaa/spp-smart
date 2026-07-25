<?php

namespace Tests\Feature\Academic;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_students_page()
    {
        $response = $this->get('/students');

        $response->assertRedirect('/login');
    }

    public function test_tata_usaha_can_access_students_page()
    {
        $admin = User::factory()->create([
            'role' => 'tata_usaha'
        ]);

        $response = $this->actingAs($admin)->get('/students');

        $response->assertStatus(200);
    }

    public function test_siswa_cannot_access_students_management_page()
    {
        $siswa = User::factory()->create([
            'role' => 'siswa'
        ]);

        $response = $this->actingAs($siswa)->get('/students');

        // Should return 403 Forbidden or Redirect depending on middleware
        // Because of Role middleware, it usually returns 403 or aborts.
        // Let's assert it's forbidden.
        $response->assertStatus(403);
    }
}
