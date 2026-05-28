<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    // Make admin load admin.jsx
    public function rootView(Request $request)
    {
        // Pilih blade root berdasarkan path atau nama route
        if ($request->is('admin') || $request->is('admin/*') || $request->routeIs('admin.*')) {
            return 'admin'; // resources/views/admin.blade.php
        }

        return 'app'; // resources/views/app.blade.php
    }
    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $cart = $request->session()->get('cart', []);
        $cartCount = collect($cart)->sum('qty');

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => $request->user(),
                'cartCount' => $cartCount,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],

            'cart' => fn () => $this->buildCartFromSession(),
        ]);
    }

    protected function buildCartFromSession(): array
    {
        // raw cart dari session: [ product_id => lineItem, ... ]
        $rawCart = session('cart', []);

        // pastikan jadi array numerik untuk dikirim ke frontend
        $items = array_values($rawCart);

        // hitung subtotal dari price * qty (sesuaikan dengan strukturmu)
        $subtotal = collect($items)->sum(function ($item) {
            $price = $item['price'] ?? 0;
            $qty   = $item['qty']   ?? 1;

            return $price * $qty;
        });

        $shipping = 0; // nanti kalau sudah ada rules pengiriman, isi di sini
        $total    = $subtotal + $shipping;

        return [
            'items'    => $items,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total'    => $total,
        ];
    }
}
