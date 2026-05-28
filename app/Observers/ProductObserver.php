<?php

// app/Observers/ProductObserver.php
namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductObserver
{
    public function deleted(Product $product): void
    {
        // pastikan semua image baris sudah terhapus (cascade); lalu hapus direktori
        $dir = "products/{$product->id}";
        if (Storage::disk('public')->directoryExists($dir)) {
            Storage::disk('public')->deleteDirectory($dir);
        }
    }
}
