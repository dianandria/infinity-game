<?php

namespace App\Imports;

use App\Imports\Sheets\ProductImagesSheetImport;
use App\Imports\Sheets\ProductsSheetImport;
use App\Imports\Sheets\ProductVariantsSheetImport;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductsWorkbookImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            0 => new ProductsSheetImport(),         // Reads the 1st tab
            1 => new ProductVariantsSheetImport(),  // Reads the 2nd tab
            2 => new ProductImagesSheetImport(),    // Reads the 3rd tab
        ];
    }
}