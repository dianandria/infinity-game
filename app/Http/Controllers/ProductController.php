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
        $q          = $request->string('q')->toString();
        $sort       = $request->input('sort', 'new');
        $categoryId = $request->input('category_id');
        $perPage    = min((int) $request->integer('per_page', 12), 50);

        $products = Product::query()
            ->with(['mainImage', 'categories:id,name,slug'])
            ->where('is_active', true)
            ->when($q, fn($qr) =>
                $qr->where(function ($w) use ($q) {
                    $w->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
                })
            )
            // Keep the filter logic
            ->when($categoryId, function ($qr) use ($categoryId) {
                return $qr->whereHas('categories', function ($query) use ($categoryId) {
                    $query->where('categories.id', $categoryId);
                });
            })
            ->when(in_array($sort, ['price_asc', 'price_desc']), function ($qr) use ($sort) {
                return $qr->orderBy('price', $sort === 'price_asc' ? 'asc' : 'desc');
            })
            ->when(in_array($sort, ['new']), function ($qr) use ($sort) {
                return $qr->orderBy('created_at', $sort === 'new' ? 'desc' : 'asc');
            })
            ->select(['id','name','slug','price','stock'])
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString(); 

        $products->getCollection()->transform(function ($p) {
            return [
                'id'        => $p->id,
                'name'      => $p->name,
                'slug'      => $p->slug,
                'price'     => $p->price,
                'stock'     => $p->stock,
                'image_url' => $p->image_url,
                'categories' => $p->categories->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])->values(),
            ];
        });

        return Inertia::render('Products/Index', [
            'filters'  => ['q' => $q, 'per_page' => $perPage, 'category_id' => $categoryId, 'sort' => $sort], 
            'products' => $products, 
            // No need to pass categories here anymore!
        ]);
    }

    public function show(Product $product)
    {
        $product->load([
            'images' => fn ($q) => $q->orderBy('is_main', 'desc')->orderBy('sort_order'),
            'mainImage',
            'categories:id,name,slug',
        ]);

        $related = Product::query()
            ->with([
                'images' => fn ($q) => $q->orderBy('is_main', 'desc')->orderBy('sort_order'),
                'mainImage',
            ])
            ->where('id', '!=', $product->id)
            ->latest('id')
            ->limit(8)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'price' => $item->price,
                    'stock' => $item->stock,
                    'image_url' => $item->image_url, // pakai accessor Product
                ];
            })
            ->values();

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'sku' => $product->sku,
                'image_url' => $product->image_url, // pakai accessor Product
                'categories' => $product->categories->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])->values(),
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'path' => $img->path,
                    'url' => $img->url, // accessor ProductImage
                    'is_main' => $img->is_main,
                    'sort_order' => $img->sort_order,
                ])->values(),
            ],
            'related' => $related,
        ]);
    }
}
