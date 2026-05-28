<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class CategoryPageController extends Controller
{
    public function show(Category $category, Request $request)
    {
        // ambil query & sort dari request
        $q    = $request->string('q')->toString();
        $sort = $request->input('sort', 'new'); // default 'new'

        $products = Product::where('is_active', true)
            ->whereHas('categories', function ($query) use ($category) {
                $query->where('categories.id', $category->id);
            })
            ->when($q, function ($qr) use ($q) {
                $qr->where(function ($w) use ($q) {
                    $w->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
                });
            })
            // sorting
            ->when($sort === 'price_asc', function ($qr) {
                $qr->orderBy('price', 'asc');
            })
            ->when($sort === 'price_desc', function ($qr) {
                $qr->orderBy('price', 'desc');
            })
            ->when($sort === 'new' || !$sort, function ($qr) {
                // default: produk terbaru duluan
                $qr->orderBy('created_at', 'desc');
            })
            ->with(['mainImage'])
            ->paginate(12)
            ->withQueryString() // penting supaya q & sort tetap ada di pagination link
            ->through(function ($product) {
                $product->thumb_url = $product->mainImage?->path ?? $product->image_url ?? null;
                return $product;
            });

        return Inertia::render('Shop/Categories/Show', [
            'category' => $category,
            'products' => $products,
            'filters'  => [
                'q'    => $q,
                'sort' => $sort,
            ],
        ]);
    }
}
