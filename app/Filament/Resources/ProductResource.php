<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Get;
use Filament\Forms\Components;
use Filament\Tables\Actions\BulkAction;
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Columns\TextColumn;
// 1. IMPORT THE EXPORT BULK ACTION CLASS
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Shop Management';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('product_key')
                    ->maxLength(100),
                Forms\Components\TextInput::make('sku')
                    ->label('SKU')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('IDR'),
                Forms\Components\TextInput::make('stock')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('is_active')
                    ->required(),
                Forms\Components\Toggle::make('is_featured')
                    ->required(),
                Forms\Components\TextInput::make('featured_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\Select::make('categories')
                    ->multiple()
                    ->relationship('categories', 'name')
                    ->preload()
                    ->searchable(),
                Components\Section::make('Images')
                    ->schema([
                        Components\Repeater::make('images')
                            ->relationship()
                            ->schema([
                                Components\Toggle::make('is_external')
                                    ->label('Use external image URL')
                                    ->live(),

                                Components\TextInput::make('external_url')
                                    ->label('Image URL')
                                    ->url()
                                    ->hidden(fn (Get $get) => ! $get('is_external'))
                                    ->required(fn (Get $get) => $get('is_external')),

                                Components\FileUpload::make('upload_path')
                                    ->label('Upload Image')
                                    ->image()
                                    ->directory('products/gallery')
                                    ->hidden(fn (Get $get) => $get('is_external'))
                                    ->required(fn (Get $get) => ! $get('is_external')),
                            ])
                            ->grid(3)
                            ->addActionLabel('Add another image')
                            ->reorderable()
                            ->collapsible()

                            ->mutateRelationshipDataBeforeFillUsing(function (array $data): array {
                                $isExternal = str_starts_with($data['path'] ?? '', 'http');
                                $data['is_external'] = $isExternal;
                                $data['external_url'] = $isExternal ? $data['path'] : null;
                                $data['upload_path'] = !$isExternal ? $data['path'] : null;
                                return $data;
                            })

                            ->mutateRelationshipDataBeforeCreateUsing(function (array $data): array {
                                $data['path'] = !empty($data['is_external']) ? $data['external_url'] : $data['upload_path'];
                                unset($data['is_external'], $data['external_url'], $data['upload_path']);
                                return $data;
                            })

                            ->mutateRelationshipDataBeforeSaveUsing(function (array $data): array {
                                $data['path'] = !empty($data['is_external']) ? $data['external_url'] : $data['upload_path'];
                                unset($data['is_external'], $data['external_url'], $data['upload_path']);
                                return $data;
                            }),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('categories.name')
                    ->label('Categories')
                    ->badge()
                    ->color('success')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('IDR', locale: 'id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stock')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('Main Image'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean(),
                Tables\Columns\TextColumn::make('featured_order')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('categories')
                    ->relationship('categories', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    BulkAction::make('assign_category')
                        ->label('Assign Category')
                        ->icon('heroicon-o-tag')
                        ->form([
                            Select::make('category_id')
                                ->label('Select a Category')
                                ->options(Category::query()->pluck('name', 'id'))
                                ->searchable()
                                ->required(),
                        ])
                        ->action(function (Collection $records, array $data): void {
                            foreach ($records as $record) {
                                $record->categories()->syncWithoutDetaching([$data['category_id']]);
                            }
                        })
                        ->deselectRecordsAfterCompletion()
                        ->successNotificationTitle('Category assigned successfully!'),
                        
                    // 2. ADD THE EXPORT BULK ACTION HERE
                    ExportBulkAction::make()
                        ->label('Export to Excel'),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}