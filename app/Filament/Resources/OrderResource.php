<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Resources\Resource;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Placeholder;
use Illuminate\Support\HtmlString;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\Repeater;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
// 1. Tambahkan import untuk Excel Export
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction; 

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?int $navigationSort = 2;

    // 2. Tambahkan method ini untuk menyembunyikan tombol Create secara global di resource ini
    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // BARIS 1: Detail Pesanan
                Section::make('Detail Pesanan')
                    ->schema([
                        Placeholder::make('date')
                            ->label('Tanggal Pesanan')
                            ->content(fn ($record) => $record?->created_at?->format('d M Y, H:i') ?? '-'),
                            
                        Placeholder::make('payment_provider')
                            ->label('Metode Pembayaran')
                            ->content(fn ($record) => $record?->payment_provider ?? '-'),
                            
                        Placeholder::make('shipping')
                            ->label('Alamat Pengiriman')
                            ->content(function ($record) {
                                if (!$record || empty($record->shipping_address)) return '-';
                                $addr = $record->shipping_address;
                                $name = $record->customer->name ?? 'Unknown';
                                return new HtmlString("
                                    <strong>{$name}</strong><br>
                                    {$addr['address']}, {$addr['city']}, {$addr['province']} - {$addr['postal']}
                                ");
                            })->columnSpanFull(),
                    ])
                    ->columns(2),

                // BARIS 2: Items 
                Section::make('Items')
                    ->schema([
                        Repeater::make('items') 
                            ->relationship()
                            ->schema([
                                TextInput::make('name')->label('Produk')->disabled(),
                                TextInput::make('price')->label('Harga')->prefix('Rp')->numeric()->disabled(),
                                TextInput::make('qty')->label('Qty')->numeric()->disabled(),
                                TextInput::make('subtotal')->label('Subtotal')->prefix('Rp')->numeric()->disabled(),
                            ])
                            ->columns(4)
                            ->addable(false)    
                            ->deletable(false)  
                            ->reorderable(false) 
                            ->label(false),      
                    ]),

                // BARIS 3: Update & Rincian
                Section::make('Update & Rincian')
                    ->schema([
                        Forms\Components\Group::make([
                            Select::make('status')
                                ->options([
                                    'pending' => 'Pending',
                                    'paid' => 'Paid',
                                    'shipped' => 'Shipped',
                                    'completed' => 'Completed',
                                    'expired' => 'Expired',
                                ])->native(false)->required(),
                            TextInput::make('shipping_awb')->label('No. Resi (AWB)'),
                        ])->columns(2)->columnSpanFull(),

                        TextInput::make('subtotal')->prefix('Rp')->numeric()->disabled(),
                        TextInput::make('shipping_fee')->prefix('Rp')->numeric()->disabled(),
                        TextInput::make('payment_fee')->prefix('Rp')->numeric()->disabled(),
                        TextInput::make('discount')->prefix('- Rp')->numeric()->disabled(),
                        TextInput::make('total')
                            ->label('Total Akhir')
                            ->prefix('Rp')
                            ->numeric()
                            ->disabled()
                            ->extraInputAttributes(['style' => 'font-weight: bold; color: #4f46e5;']),
                    ])
                    ->columns(4), 
            ])
            ->columns(1); 
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('code')
                    ->searchable(), 
                    
                TextColumn::make('created_at')
                    ->label('created_at')
                    ->dateTime('n/j/Y, h:i:s A') 
                    ->sortable(),
                    
                TextColumn::make('customer_name') 
                    ->label('customer')
                    ->description(fn ($record) => $record->customer_email ?? '-') 
                    ->searchable(['name', 'email']), 
                    
                TextColumn::make('total')
                    ->label('total')
                    ->money('idr', locale: 'id') 
                    ->sortable(),
                    
                TextColumn::make('payment_provider')
                    ->label('provider')
                    ->searchable(),
                    
                TextColumn::make('status')
                    ->label('status')
                    ->badge() 
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',     
                        'expired' => 'gray',     
                        'pending' => 'warning',  
                        'shipped' => 'info',     
                        default => 'primary',
                    }),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'expired' => 'Expired',
                    ]),
                    
                SelectFilter::make('provider')
                    ->options([
                        'ipaymu' => 'iPaymu',
                    ]),
                    
                Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')->label('Dari Tanggal'),
                        Forms\Components\DatePicker::make('created_until')->label('Sampai Tanggal'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label('View')
                    ->icon('heroicon-m-eye') 
                    ->color('primary'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    // 3. Tambahkan fungsi Export Excel di sini
                    ExportBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            // ItemsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            // 4. Hapus route 'create' karena tombol sudah kita sembunyikan
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}