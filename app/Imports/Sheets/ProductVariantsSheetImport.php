<?php

namespace App\Imports\Sheets;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductVariantsSheetImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $productKey  = trim((string) ($row['product_key'] ?? ''));
                $variantCode = trim((string) ($row['variant_code'] ?? ''));

                if ($productKey === '' || $variantCode === '') {
                    continue;
                }

                $product = Product::where('product_key', $productKey)->first();
                if (! $product) {
                    continue;
                }

                $variantName = trim((string) ($row['variant_name'] ?? ''));
                $sku         = trim((string) ($row['sku'] ?? ''));
                $price       = $this->normalizeNumber($row['price'] ?? 0);
                $stock       = (int) $this->normalizeNumber($row['stock'] ?? 0);

                $variant = ProductVariant::updateOrCreate(
                    [
                        'variant_code' => $variantCode,
                    ],
                    [
                        'product_id'    => $product->id,
                        'variant_name'  => $variantName !== '' ? $variantName : null,
                        'sku'           => $sku !== '' ? $sku : null,
                        'price'         => $price,
                        'stock'         => $stock,
                    ]
                );

                // update product price & stock
                $this->updateProductTotals($productKey);
            }
        });
    }

    protected function updateProductTotals(string $productKey): void
    {
        $product = Product::where('product_key', $productKey)->first();
        if (!$product) {
            return;
        }

        $variants = ProductVariant::where('product_id', $product->id);

        $product->price = $variants->min('price') ?? 0;
        $product->stock = $variants->sum('stock') ?? 0;

        $product->save();
    }

    protected function normalizeNumber($value): float|int
    {
        if ($value === null || $value === '') {
            return 0;
        }

        if (is_numeric($value)) {
            return $value + 0;
        }

        $value = str_replace(['.', ','], ['', '.'], (string) $value);

        return is_numeric($value) ? $value + 0 : 0;
    }

    public function rules(): array
    {
        return [
            '*.product_key' => ['required', 'max:100'],
            '*.product_name' => ['nullable', 'string', 'max:255'],
            '*.variant_code' => ['required'],
            '*.variant_name' => ['nullable', 'string', 'max:255'],
            '*.sku' => ['nullable', 'string', 'max:100'],
            '*.price' => ['nullable'],
            '*.stock' => ['nullable'],
        ];
    }

    public function chunkSize(): int
    {
        return 500;
    }
}