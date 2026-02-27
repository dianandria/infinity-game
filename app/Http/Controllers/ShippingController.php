<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RajaOngkirService;

class ShippingController extends Controller
{
    public function __construct(
        protected RajaOngkirService $rajaOngkirService
    ) {}

    public function getCities($provinceId)
    {
        try {
            $cities = $this->rajaOngkirService->getCities($provinceId);

            return response()->json($cities['data'] ?? []); // Menyediakan data kota dalam bentuk JSON
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getDistricts($cityId)
    {
        try {
            $districts = $this->rajaOngkirService->getDistricts($cityId);

            return response()->json($districts['data'] ?? []); // Menyediakan data kecamatan dalam bentuk JSON
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function calculateCost(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'origin' => 'required|integer',
            'destination' => 'required|integer',
            'weight' => 'required|integer',
            'courier' => 'required|string',
            'price' => 'nullable|string',
        ]);

        try {
            // Panggil service untuk menghitung ongkir
            $cost = $this->rajaOngkirService->calculateShippingCost(
                $validated['origin'],
                $validated['destination'],
                $validated['weight'],
                $validated['courier'],
                $validated['price'] ?? 'lowest'
            );

            return response()->json($cost);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
