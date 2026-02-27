<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Shop/About/Index', [
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
