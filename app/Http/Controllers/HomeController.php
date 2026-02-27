<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Slider;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $sliders = Slider::where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        $featuredProducts = Product::where('is_featured', true)
            ->orderBy('featured_order')
            ->orderByDesc('id')
            ->with(['mainImage']) // sesuaikan dengan relasi yang kamu punya
            ->take(8)
            ->get()
            ->transform(function ($product) {
                // fallback image_url / mainImage
                $product->thumb_url = $product->mainImage?->url ?? $product->image_url ?? null;
                return $product;
            });

        $featuredCategories = Category::query()
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'banner_path', 'order']);

        return Inertia::render('Home', [
            'sliders'          => $sliders,
            'featuredProducts' => $featuredProducts,
            'featuredCategories' => $featuredCategories,
        ]);
    }
}
