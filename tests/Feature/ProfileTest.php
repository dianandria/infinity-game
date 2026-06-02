<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'name' => 'Test User',
            'email' => $user->email,
            'phone' => '081234567890',
            'address' => 'Jl. Mawar No. 1',
            'province_id' => 1,
            'province' => 'Bali',
            'city_id' => 2,
            'city' => 'Denpasar',
            'district_id' => 3,
            'district' => 'Denpasar Selatan',
            'postal_code' => '80222',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile');

    $user->refresh();

    $this->assertSame('Test User', $user->name);
    $this->assertSame('081234567890', $user->phone);
    $this->assertSame('Jl. Mawar No. 1', $user->address);
    $this->assertSame(1, $user->province_id);
    $this->assertSame('Bali', $user->province);
    $this->assertSame(2, $user->city_id);
    $this->assertSame('Denpasar', $user->city);
    $this->assertSame(3, $user->district_id);
    $this->assertSame('Denpasar Selatan', $user->district);
    $this->assertSame('80222', $user->postal_code);
    $this->assertNotNull($user->email_verified_at);
});

test('profile email address is locked', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasErrors('email')
        ->assertRedirect();

    $this->assertSame($user->email, $user->fresh()->email);
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile');

    $this->assertNotNull($user->refresh()->email_verified_at);
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/profile', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    $this->assertNull($user->fresh());
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/profile')
        ->delete('/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/profile');

    $this->assertNotNull($user->fresh());
});
