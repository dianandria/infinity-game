<?php

namespace App\Imports\Sheets;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductsSheetImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $productKey = trim((string) ($row['product_key'] ?? ''));
                $sku        = trim((string) ($row['sku'] ?? ''));
                $name       = trim((string) ($row['name'] ?? ''));
                $price       = trim((string) ($row['price'] ?? '0'));

                if ($productKey === '' || $sku === '' || $name === '') {
                    continue;
                }

                $product = Product::withTrashed()->firstOrNew([
                    'product_key' => $productKey,
                ]);

                if (method_exists($product, 'trashed') && $product->trashed()) {
                    $product->restore();
                }

                $product->sku = $sku;
                $product->name = $name;
                $product->description = (string) ($row['description'] ?? '');
                $product->price = $price;

                $rawActive = $row['is_active'] ?? 1;
                $isActive = filter_var($rawActive, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                if ($isActive === null) {
                    $isActive = in_array((string) $rawActive, ['1', 'yes', 'YES', 'true', 'TRUE'], true);
                }

                $product->is_active = $isActive;
                $product->save();
            }
        });
    }

    public function rules(): array
    {
        return [
            '*.product_key' => ['nullable', 'max:100'],
            '*.sku' => ['nullable', 'string', 'max:100'],
            '*.name' => ['nullable', 'string', 'max:255'],
            '*.description' => ['nullable', 'string'],
            '*.is_active' => ['nullable']
        ];
    }

    public function chunkSize(): int
    {
        return 500;
    }
}