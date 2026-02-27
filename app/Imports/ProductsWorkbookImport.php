<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductsWorkbookImport implements WithMultipleSheets
{
    /**
    * @param Collection $collection
    */
    public function sheets(): array
    {
        return [
            'products' => new Sheets\ProductsSheetImport(),
            'product_images' => new Sheets\ProductImagesSheetImport(),
        ];
    }
}
