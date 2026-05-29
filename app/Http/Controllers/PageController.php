<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Slider;

class PageController extends Controller
{
    public function about()
    {
        $sliders = Slider::where('is_active', true)
            ->where('placement', 'about')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Shop/About/Index', [
            'sliders' => $sliders,
            'about' => [
                'title'   => 'About Us',
                'tagline' => 'We create products that are made to last.',
                'intro'   => 'Kami adalah brand yang fokus pada kualitas, detail, dan pengalaman belanja yang menyenangkan untuk pelanggan kami.',
                'highlights' => [
                    [
                        'title' => 'Quality First',
                        'text'  => 'Kami hanya bekerja dengan material dan partner produksi yang bisa menjaga standar kualitas tinggi.',
                    ],
                    [
                        'title' => 'Customer Centric',
                        'text'  => 'Setiap keputusan kami berangkat dari kebutuhan dan kenyamanan pelanggan.',
                    ],
                    [
                        'title' => 'Long-term Partnership',
                        'text'  => 'Kami percaya hubungan jangka panjang lebih bernilai daripada transaksi satu kali.',
                    ],
                ],
                'stats' => [
                    [
                        'label' => 'Years of Experience',
                        'value' => '5+',
                    ],
                    [
                        'label' => 'Products Delivered',
                        'value' => '10K+',
                    ],
                    [
                        'label' => 'Happy Clients',
                        'value' => '1K+',
                    ],
                ],
            ],
        ]);
    }
}
