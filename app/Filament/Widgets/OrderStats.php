<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class OrderStats extends BaseWidget
{
    protected static ?int $sort = 1;

    // Membagi tampilan menjadi 2 kolom agar berpasangan (Penjualan & Order)
    protected function getColumns(): int
    {
        return 2; 
    }

    protected function getStats(): array
    {
        $today = Carbon::today();
        $now = Carbon::now();

        // --- 1. DATA HARI INI ---
        $salesToday = Order::where('status', 'paid')
            ->whereDate('created_at', $today)
            ->sum('total');

        $ordersToday = Order::where('status', 'paid')
            ->whereDate('created_at', $today)
            ->count();

        // --- 2. DATA BULAN INI ---
        $salesThisMonth = Order::where('status', 'paid')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('total');

        $ordersThisMonth = Order::where('status', 'paid')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();

        // --- 3. DATA KESELURUHAN ---
        $overallSales = Order::where('status', 'paid')
            ->sum('total');

        $overallOrders = Order::where('status', 'paid')->count();

        return [
            // --- BARIS 1: HARI INI ---
            Stat::make('Penjualan Hari Ini', 'Rp ' . number_format($salesToday, 0, ',', '.'))
                ->description('Pendapatan hari ini')
                ->descriptionIcon('heroicon-m-bolt')
                ->color('success'),

            Stat::make('Order Hari Ini', number_format($ordersToday, 0, ',', '.'))
                ->description('Pesanan masuk hari ini')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            // --- BARIS 2: BULAN INI ---
            Stat::make('Penjualan Bulan Ini', 'Rp ' . number_format($salesThisMonth, 0, ',', '.'))
                ->description('Total pendapatan bulan ini')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('Order Bulan Ini', number_format($ordersThisMonth, 0, ',', '.'))
                ->description('Jumlah pesanan masuk bulan ini')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('primary'),

            // --- BARIS 3: KESELURUHAN ---
            Stat::make('Penjualan Keseluruhan', 'Rp ' . number_format($overallSales, 0, ',', '.'))
                ->description('Total pendapatan keseluruhan')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Total Order', number_format($overallOrders, 0, ',', '.'))
                ->description('Total seluruh pesanan')
                ->descriptionIcon('heroicon-m-inbox-stack')
                ->color('primary'),
        ];
    }
}