<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q       = $request->string('q')->toString();
        $sort    = $request->input('sort');
        $perPage = min((int) $request->integer('per_page', 12), 50);
        $products = Product::query()
            ->when($q, fn($qr) =>
                $qr->where(function ($w) use ($q) {
                    $w->where('name', 'like', "%{$q}%")
                      ->orWhere('description', 'like', "%{$q}%");
                })
            )
            ->when(in_array($sort, ['price_asc', 'price_desc']), function ($qr) use ($sort) {
                return $qr->orderBy('price', $sort === 'price_asc' ? 'asc' : 'desc');
            })
            ->when(in_array($sort, ['new']), function ($qr) use ($sort) {
                return $qr->orderBy('created_at', $sort === 'new' ? 'desc' : 'asc');
            })
            ->select(['id','name','slug','price','stock','image_url'])
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString(); // supaya query ?q=... tetap ada saat paging

        // Transform ringan biar payload rapi
        $products->getCollection()->transform(function ($p) {
            return [
                'id'        => $p->id,
                'name'      => $p->name,
                'slug'      => $p->slug,
                'price'     => $p->price,
                'stock'     => $p->stock,
                'image_url' => $p->image_url,
            ];
        });

        return Inertia::render('Products/Index', [
            'filters'  => ['q' => $q, 'per_page' => $perPage],
            'products' => $products, // paginator akan otomatis di-serialize untuk React
        ]);
    }

    public function show(Product $product)
    {
        $product->load('images');
        
        // Related sederhana: produk terbaru selain produk ini
        $related = Product::query()
            ->where('id', '!=', $product->id)
            ->latest('id')
            ->limit(8)
            ->get(['id','name','slug','price','stock','image_url']);

        return Inertia::render('Products/Show', [
            'product' => [
                'id'          => $product->id,
                'name'        => $product->name,
                'slug'        => $product->slug,
                'description' => $product->description,
                'price'       => $product->price,
                'stock'       => $product->stock,
                'image_url'   => $product->image_url,
                'images'      => $product->images
                // kalau kamu punya multiple images, kirim array 'images' di sini
            ],
            'related' => $related,
        ]);
    }
}
