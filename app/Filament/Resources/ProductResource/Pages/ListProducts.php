<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Forms\Components\FileUpload;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;

class ListProducts extends ListRecords
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('importExcel')
                ->label('Import Excel')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('success')
                ->form([
                    FileUpload::make('file')
                        ->label('Select Excel File')
                        ->required()
                        ->disk('public') // Make sure this matches your setup
                ])
                ->action(function (array $data) {
                    // Get the absolute path to the uploaded file
                    $filePath = storage_path('app/public/' . $data['file']);

                    // Create a valid UploadedFile instance
                    $uploadedFile = new UploadedFile(
                        $filePath,
                        basename($filePath),
                        mime_content_type($filePath) ?: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        null,
                        true // IMPORTANT: Set $test = true to bypass PHP's is_uploaded_file() check
                    );

                    // Create the request and attach the file object
                    $request = new Request();
                    $request->files->set('file', $uploadedFile);

                    // Call your controller
                    $controller = app(ProductController::class);
                    return $controller->importExcel($request);
                }),
            Actions\CreateAction::make(),
        ];
    }
}
