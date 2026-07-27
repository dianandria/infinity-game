<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Filament\Support\RawJs;
use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;

// Tambahkan import ini untuk menangkap Event Javascript
use Livewire\Attributes\On;

class MonthlySalesChart extends ChartWidget implements HasActions, HasForms 
{
    use InteractsWithActions; 
    use InteractsWithForms;

    protected static ?string $heading = 'Grafik Penjualan & Pesanan Bulanan';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';

    // 1. Beri tahu class ini untuk menggunakan View kustom yang baru kita buat
    protected static string $view = 'filament.widgets.monthly-sales-chart';

    protected function getFilters(): ?array
    {
        $currentYear = Carbon::now()->year;
        return [
            $currentYear => (string) $currentYear,
            $currentYear - 1 => (string) ($currentYear - 1),
            $currentYear - 2 => (string) ($currentYear - 2),
            $currentYear - 3 => (string) ($currentYear - 3),
        ];
    }

    protected function getData(): array
    {
        $year = $this->filter ? (int) $this->filter : Carbon::now()->year;

        $orders = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(total) as revenue'),
            DB::raw('COUNT(id) as total_orders')
        )
        ->whereYear('created_at', $year)
        ->where('status', 'paid') 
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        $revenueData = array_fill(0, 12, 0);
        $orderData = array_fill(0, 12, 0);

        foreach ($orders as $order) {
            $monthIndex = $order->month - 1; 
            $revenueData[$monthIndex] = $order->revenue;
            $orderData[$monthIndex] = $order->total_orders;
        }

        return [
            'datasets' => [
                [
                    'label' => "Total Penjualan (Rp) - {$year}",
                    'data' => $revenueData,
                    'backgroundColor' => '#10b981', 
                    'borderColor' => '#10b981',
                    'yAxisID' => 'y',
                ],
                [
                    'label' => "Jumlah Order - {$year}",
                    'data' => $orderData,
                    'backgroundColor' => '#3b82f6', 
                    'borderColor' => '#3b82f6',
                    'yAxisID' => 'y1', 
                ],
            ],
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            // 2. Ubah pemanggilan JS menjadi event Livewire global
            'onClick' => RawJs::make(<<<'JS'
                function(event, elements) {
                    if (elements.length > 0) {
                        var index = elements[0].index;
                        // Memicu event Livewire alih-alih memanggil $wire langsung
                        Livewire.dispatch('openMonthDetails', { monthIndex: index });
                    }
                }
            JS),
            'interaction' => [
                'mode' => 'index',
                'intersect' => false,
            ],
            'plugins' => [
                'tooltip' => [
                    'enabled' => true, 
                ],
            ],
            'scales' => [
                'y' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'left',
                    'title' => [
                        'display' => true,
                        'text' => 'Pendapatan (Rp)'
                    ]
                ],
                'y1' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'right',
                    'grid' => [
                        'drawOnChartArea' => false, 
                    ],
                    'title' => [
                        'display' => true,
                        'text' => 'Jumlah Order'
                    ],
                    'ticks' => [
                        'stepSize' => 1,
                    ],
                ],
            ],
        ];
    }

    // 3. Tambahkan pendengar (listener) untuk menangkap event dari Javascript tadi
    #[On('openMonthDetails')]
    public function handleOpenMonthDetails($data)
    {
        // Jalankan Action Slide-over saat event diterima
        $this->mountAction('showMonthDetails', ['monthIndex' => $data['monthIndex']]);
    }

    // 4. Action Slide-over Anda (Tetap sama)
    public function showMonthDetailsAction(): Action
    {
        return Action::make('showMonthDetails')
            ->slideOver() 
            ->modalHeading(function (array $arguments) {
                $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                $monthName = $months[$arguments['monthIndex'] ?? 0];
                $year = $this->filter ? (int) $this->filter : Carbon::now()->year;
                
                return "Detail Penjualan: {$monthName} {$year}";
            })
            ->modalSubmitAction(false) 
            ->modalCancelActionLabel('Tutup')
            ->form(function (array $arguments) {
                $monthIndex = $arguments['monthIndex'] ?? 0;
                $month = $monthIndex + 1; 
                $year = $this->filter ? (int) $this->filter : Carbon::now()->year;

                $sales = Order::where('status', 'paid')
                    ->whereYear('created_at', $year)
                    ->whereMonth('created_at', $month)
                    ->sum('total');

                $paidOrders = Order::where('status', 'paid')
                    ->whereYear('created_at', $year)
                    ->whereMonth('created_at', $month)
                    ->count();
                    
                $pendingOrders = Order::where('status', 'pending')
                    ->whereYear('created_at', $year)
                    ->whereMonth('created_at', $month)
                    ->count();

                return [
                    Section::make('Ringkasan Bulan Ini')
                        ->schema([
                            Placeholder::make('total_sales')
                                ->label('Total Pendapatan Bersih (Paid)')
                                ->content('Rp ' . number_format($sales, 0, ',', '.')),
                                
                            Placeholder::make('paid_orders')
                                ->label('Pesanan Selesai (Paid)')
                                ->content($paidOrders . ' Pesanan'),
                                
                            Placeholder::make('pending_orders')
                                ->label('Pesanan Menunggu Pembayaran (Pending)')
                                ->content($pendingOrders . ' Pesanan'),
                        ])
                        ->columns(1), 
                ];
            });
    }
}