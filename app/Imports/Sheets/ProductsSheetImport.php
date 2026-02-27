<?php

namespace App\Imports\Sheets;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class ProductsSheetImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading
{
    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $productKey = trim((string) ($row['product_key'] ?? ''));
                $sku        = trim((string) ($row['sku'] ?? ''));
                $name       = trim((string) ($row['name'] ?? ''));

                if ($productKey === '' || $sku === '' || $name === '') {
                    continue;
                }

                // Upsert by product_key (recommended)
                $product = Product::withTrashed()->firstOrNew([
                    'product_key' => $productKey,
                ]);

                // If previously deleted, restore
                if (method_exists($product, 'restore') && $product->trashed()) {
                    $product->restore();
                }

                $product->sku = $sku;
                $product->name = $name;
                $product->description = (string) ($row['description'] ?? '');

                // is_active: accept 1/0, true/false, yes/no
                $rawActive = $row['is_active'] ?? 1;
                $isActive = filter_var($rawActive, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($isActive === null) {
                    // fallback for "1"/"0"
                    $isActive = ((string)$rawActive === '1');
                }
                $product->is_active = $isActive;

                // Optional: kalau kamu punya kolom slug, bisa generate dari name
                // $product->slug = Str::slug($name);

                $product->save();
            }
        });
    }

    public function rules(): array
    {
        return [
            '*.product_key' => ['required', 'string', 'max:100'],
            '*.sku' => ['required', 'string', 'max:100'],
            '*.name' => ['required', 'string', 'max:255'],
            '*.description' => ['nullable', 'string'],
            '*.is_active' => ['nullable'], // kita parse manual
        ];
    }

    public function chunkSize(): int
    {
        return 500;
    }
}