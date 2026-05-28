<?php

namespace App\Imports\Sheets;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class ProductImagesSheetImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading
{
    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $productKey = trim((string) ($row['product_key'] ?? ''));
                if ($productKey === '') continue;

                $product = Product::where('product_key', $productKey)->first();
                if (!$product) continue; // atau throw kalau mau strict

                // Ambil image1..image8
                $urls = [];
                for ($i = 1; $i <= 8; $i++) {
                    $val = trim((string) ($row["image{$i}"] ?? ''));
                    if ($val !== '') $urls[] = $val;
                }

                if (count($urls) === 0) continue;

                // Strategy: sync image set (hapus yang tidak ada di excel, update urutan)
                // 1) mapping url => position
                $urlToPosition = collect($urls)->values()->mapWithKeys(function ($url, $idx) {
                    return [$url => $idx + 1];
                });

                // 2) ambil existing images
                $existing = ProductImage::where('product_id', $product->id)->get();

                // 3) delete images yang tidak ada di excel
                $existingToDelete = $existing->filter(fn ($img) => !$urlToPosition->has($img->url));
                if ($existingToDelete->isNotEmpty()) {
                    ProductImage::whereIn('id', $existingToDelete->pluck('id'))->delete();
                }

                // 4) upsert images yang ada di excel
                foreach ($urlToPosition as $url => $pos) {
                    $img = ProductImage::firstOrNew([
                        'product_id' => $product->id,
                        'path' => $url,
                    ]);
                    $img->sort_order = $pos;
                    $img->save();
                }
            }
        });
    }

    public function rules(): array
    {
        return [
            '*.product_key' => ['required', 'max:100'],
            '*.image1' => ['nullable', 'url'],
            '*.image2' => ['nullable', 'url'],
            '*.image3' => ['nullable', 'url'],
            '*.image4' => ['nullable', 'url'],
            '*.image5' => ['nullable', 'url'],
            '*.image6' => ['nullable', 'url'],
            '*.image7' => ['nullable', 'url'],
            '*.image8' => ['nullable', 'url'],
        ];
    }

    public function chunkSize(): int
    {
        return 500;
    }
}
