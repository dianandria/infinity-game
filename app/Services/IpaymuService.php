<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IpaymuService
{
    // DIRECT PAYMENT
    public function directPayment(array $payload)
    {
        $baseUrl = config('services.ipaymu.base_url');
        $va      = config('services.ipaymu.va');
        $apiKey  = config('services.ipaymu.api_key');
        $method  = 'POST';

        // 1) JSON encode (minified) seperti contoh cURL kamu
        $bodyJson = json_encode($payload, JSON_UNESCAPED_SLASHES);

        // 2) SHA256 body (lowercase)
        $bodyHash = strtolower(hash('sha256', $bodyJson));

        // 3) StringToSign = HTTPMethod:VaNumber:Lowercase(SHA-256(RequestBody)):ApiKey
        $stringToSign = $method . ':' . $va . ':' . $bodyHash . ':' . $apiKey;

        // 4) Signature = HMAC-SHA256(StringToSign, ApiKey)
        $signature = hash_hmac('sha256', $stringToSign, $apiKey);

        // 5) Timestamp (versi dokumentasi: YYYYMMDDHHmmss)
        $timestamp = now()->format('YmdHis');

        // 6) Kirim request ke iPaymu
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'va'           => $va,
            'signature'    => $signature,
            'timestamp'    => $timestamp,
        ])->post($baseUrl . '/api/v2/payment/direct', $payload);

        if (! $response->ok()) {
            throw new \RuntimeException('iPaymu HTTP error: '.$response->status());
        }

        $json = $response->json();

        if (($json['Status'] ?? 400) !== 200) {
            throw new \RuntimeException('iPaymu error: '.($json['Message'] ?? 'unknown'));
        }

        return $json['Data'] ?? [];
    }

    // LIST PAYMENT METHOD
    public function paymentChannels(array $query = []): array
    {
        $baseUrl = config('services.ipaymu.base_url');
        $va      = config('services.ipaymu.va');
        $apiKey  = config('services.ipaymu.api_key');
        $method  = 'GET';

        // 1) Bangun "queryParamsObj" ala Postman
        //    - Kalau tidak ada query -> {} -> JSON-nya "{}"
        //    - Kalau ada ?foo=bar&baz=1 -> {"foo":"bar","baz":"1"}
        $queryObj = (object) $query; // (object)[] -> {} di JSON
        $reqJson  = json_encode($queryObj, JSON_UNESCAPED_SLASHES);

        // 2) Hash SHA256(reqJson) → hasil hex lowercase (sama dengan CryptoJS)
        $bodyEncrypt = hash('sha256', $reqJson);

        // 3) StringToSign = METHOD:VA:hash(reqJson):APIKEY
        $stringToSign = $method . ':' . $va . ':' . $bodyEncrypt . ':' . $apiKey;

        // 4) Signature = HMAC-SHA256(StringToSign, ApiKey)
        $signature = hash_hmac('sha256', $stringToSign, $apiKey);

        // 5) Timestamp format: YYYYMMDDHHMMSS (bukan ISO!)
        $timestamp = now()->format('YmdHis');

        // (Opsional) log buat debug
        Log::info('Ipaymu payment-channels request', [
            'reqJson'      => $reqJson,
            'bodyEncrypt'  => $bodyEncrypt,
            'stringToSign' => $stringToSign,
            'signature'    => $signature,
            'timestamp'    => $timestamp,
        ]);

        // 6) Kirim request ke iPaymu (kalau mau pakai query, kirim lewat ->get(url, $query))
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'va'           => $va,
            'signature'    => $signature,
            'timestamp'    => $timestamp,
        ])->get($baseUrl . '/api/v2/payment-channels', $query);

        if (! $response->ok()) {
            Log::error('Ipaymu HTTP error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new \RuntimeException('iPaymu HTTP error: '.$response->status().' '.$response->body());
        }

        $json = $response->json();

        if (($json['Status'] ?? 400) !== 200) {
            Log::error('Ipaymu logical error', ['json' => $json]);
            throw new \RuntimeException('iPaymu error: '.($json['Message'] ?? 'unknown'));
        }

        return $json['Data'] ?? [];
    }
}
