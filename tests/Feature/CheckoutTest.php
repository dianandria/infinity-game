<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

test('checkout is prefilled from user profile', function () {
    Http::fake([
        '*payment-channels*' => Http::response([
            'Status' => 200,
            'Data' => [
                [
                    'Code' => 'va',
                    'Name' => 'Virtual Account',
                    'Channels' => [
                        ['Code' => 'bca', 'Name' => 'BCA'],
                    ],
                ],
            ],
        ]),
        '*destination/province*' => Http::response([
            'data' => [
                ['id' => 1, 'name' => 'Bali'],
            ],
        ]),
    ]);

    $user = User::factory()->create([
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

    $response = $this
        ->actingAs($user)
        ->withSession([
            'cart' => [
                1 => [
                    'product_id' => 1,
                    'name' => 'Sample Product',
                    'price' => 100000,
                    'qty' => 1,
                ],
            ],
        ])
        ->get('/checkout');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Checkout/Index')
        ->where('prefill.name', $user->name)
        ->where('prefill.email', $user->email)
        ->where('prefill.phone', '081234567890')
        ->where('prefill.address', 'Jl. Mawar No. 1')
        ->where('prefill.province_id', 1)
        ->where('prefill.province', 'Bali')
        ->where('prefill.city_id', 2)
        ->where('prefill.city', 'Denpasar')
        ->where('prefill.district_id', 3)
        ->where('prefill.district', 'Denpasar Selatan')
        ->where('prefill.postal_code', '80222')
    );
});
