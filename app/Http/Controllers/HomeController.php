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
        $categoryOrder = ['Xbox', 'Playstation', 'Nintendo', 'Blu-Ray & Movie', 'Video Games', 'Voucher Games'];

        $sliders = Slider::where('is_active', true)
            ->where('placement', 'home')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        $featuredProducts = Product::where('is_featured', true)
            ->orderBy('featured_order')
            ->orderByDesc('id')
            ->with(['mainImage', 'categories:id,name,slug']) // sesuaikan dengan relasi yang kamu punya
            ->take(8)
            ->get()
            ->transform(function ($product) {
                // fallback image_url / mainImage
                $product->thumb_url = $product->mainImage?->url ?? $product->image_url ?? null;
                return $product;
            });

        $featuredCategories = Category::query()
            ->whereIn('name', $categoryOrder)
            ->get(['id', 'name', 'slug', 'banner_path', 'order'])
            ->sortBy(fn ($category) => array_search($category->name, $categoryOrder))
            ->values();

        return Inertia::render('Home', [
            'sliders'          => $sliders,
            'featuredProducts' => $featuredProducts,
            'featuredCategories' => $featuredCategories,
        ]);
    }
}
