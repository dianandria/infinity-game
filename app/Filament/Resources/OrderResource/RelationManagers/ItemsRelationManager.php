<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('product_id')
                    ->label('ID Produk')
                    ->sortable(),
                    
                TextColumn::make('name')
                    ->label('Nama Produk')
                    ->searchable(),
                    
                TextColumn::make('price')
                    ->label('Harga')
                    ->money('idr', locale: 'id'),
                    
                TextColumn::make('qty')
                    ->label('Qty')
                    ->alignCenter(),
                    
                TextColumn::make('subtotal')
                    ->label('Subtotal')
                    ->money('idr', locale: 'id')
                    ->weight('bold'),
            ])
            // Karena ini detail pesanan, biasanya kita hapus aksi Create/Edit/Delete dari sini
            // agar data item yang sudah dipesan tidak dimanipulasi kasir sembarangan.
            ->actions([]) 
            ->headerActions([])
            ->bulkActions([]);
    }
}
