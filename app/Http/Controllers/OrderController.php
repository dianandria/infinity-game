<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->latest()
            ->paginate(10)              // <— paginate, bukan get()
            ->withQueryString();        // supaya query param tetap ke-bawa kalau ada

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order)
    {
        // Pastikan order ini milik user yang login
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        
        $order->load('items');

        return Inertia::render('Orders/Show', [
            'order' => [
                'id'               => $order->id,
                'code'             => $order->code,
                'status'           => $order->status,
                'subtotal'         => $order->subtotal,
                'shipping_fee'     => $order->shipping_fee,
                'discount'         => $order->discount,
                'total'            => $order->total,
                'payment_provider' => $order->payment_provider,
                'payment_ref'      => $order->payment_ref,
                'paid_at'          => $order->paid_at,
                'created_at'       => $order->created_at,
                'customer_name'    => $order->customer_name,
                'customer_email'   => $order->customer_email,
                'customer_phone'   => $order->customer_phone,
                'shipping_address' => $order->shipping_address,
                'payment_fee'      => $order->payment_fee,

                // sesuaikan dengan kolommu
                'shipping_code' => $order->shipping_code ?? null,
                'shipping_awb'     => $order->shipping_awb ?? null,

                'items' => $order->items->map(function ($item) {
                    return [
                        'id'       => $item->id,
                        'product_id' => $item->product_id,
                        'name'     => $item->name,
                        'price'    => $item->price,
                        'qty'      => $item->qty,
                        'subtotal' => $item->subtotal,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Endpoint JSON untuk tracking pengiriman
     */
    public function tracking(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (!$order->shipping_code|| !$order->shipping_awb) {
            return response()->json([
                'message' => 'Tracking belum tersedia untuk order ini.',
                'data'    => null,
            ], 404);
        }

        // Contoh pseudo-call ke RajaOngkir.
        // Di real code, bagusnya pakai service khusus, misal RajaOngkirService.
        try {
            // Misal:
            // $response = Http::withHeaders([
            //     'key' => config('services.rajaongkir.key'),
            // ])->post('https://rajaongkir.komerce.id/api/v1/track/waybill', [
            //     'awb'     => $order->shipping_awb,
            //     'courier' => $order->shipping_courier,
            // ]);

            // Di sini aku buat data dummy biar struktur frontend-nya jelas
            $tracking = [
                'summary' => [
                    'courier' => strtoupper($order->shipping_code),
                    'awb'     => $order->shipping_awb,
                    'status'  => 'ON PROCESS',
                ],
                // 'manifest' => [
                //     [
                //         'date'        => '2025-12-08',
                //         'time'        => '10:12',
                //         'description' => 'Paket diterima di gudang origin',
                //         'city'        => 'Bandung',
                //     ],
                //     [
                //         'date'        => '2025-12-09',
                //         'time'        => '08:30',
                //         'description' => 'Paket dalam proses pengiriman ke kota tujuan',
                //         'city'        => 'Jakarta',
                //     ],
                // ],
            ];

            return response()->json([
                'message' => 'OK',
                'data'    => $tracking,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal mengambil data tracking.',
                'data'    => null,
            ], 500);
        }
    }
}
