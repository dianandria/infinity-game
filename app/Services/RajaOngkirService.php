<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.rajaongkir.base_url');
        $this->apiKey = config('services.rajaongkir.api_key');
    }

    /**
     * Get list of provinces from RajaOngkir API
     *
     * @return array
     */
    public function getProvinces()
    {
        // Request ke API RajaOngkir untuk mendapatkan data provinsi
        $response = Http::withHeaders([
            'Key' => $this->apiKey,
        ])->get($this->baseUrl . '/destination/province');

        if ($response->failed()) {
            throw new \Exception('Gagal mengambil data provinsi dari RajaOngkir');
        }

        return $response->json();
    }

    /**
     * Get list of cities from RajaOngkir API based on province ID
     *
     * @param int $provinceId
     * @return array
     */
    public function getCities($provinceId)
    {
        $response = Http::withHeaders([
            'Key' => $this->apiKey,
        ])->get($this->baseUrl . "/destination/city/{$provinceId}");

        if ($response->failed()) {
            throw new \Exception('Gagal mengambil data kota dari RajaOngkir');
        }

        return $response->json();
    }

    /**
     * Get list of districts from RajaOngkir API based on city ID
     *
     * @param int $cityId
     * @return array
     */
    public function getDistricts($cityId)
    {
        $response = Http::withHeaders([
            'Key' => $this->apiKey,
        ])->get($this->baseUrl . "/destination/district/{$cityId}");

        if ($response->failed()) {
            throw new \Exception('Gagal mengambil data kecamatan dari RajaOngkir');
        }

        return $response->json();
    }

    /**
     * Calculate shipping cost from RajaOngkir API
     *
     * @param int $originId
     * @param int $destinationId
     * @param int $weight
     * @param string $courier
     * @param string $price
     * @return array
     */
    public function calculateShippingCost($originId, $destinationId, $weight, $courier, $price = 'lowest')
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey,
        ])
        ->asForm()  // Mengirimkan data sebagai form URL encoded
        ->post($this->baseUrl . '/calculate/district/domestic-cost', [
            'origin' => $originId,
            'destination' => $destinationId,
            'weight' => $weight,
            'courier' => $courier,
            'price' => $price,
        ]);

        if ($response->failed()) {
            throw new \Exception('Gagal menghitung ongkir');
        }

        return $response->json();
    }
}
