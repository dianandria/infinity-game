<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');
        $perPage = min((int) $request->query('per_page', 12), 50);

        $products = Product::query()
            ->when($q, fn($qr) =>
                $qr->where('name', 'like', "%{$q}%")
                   ->orWhere('description', 'like', "%{$q}%")
            )
            ->orderByDesc('id')
            ->paginate($perPage)
            ->through(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'price' => $p->price,
                    'stock' => $p->stock,
                    'image_url' => $p->image_url,
                ];
            });

        return response()->json($products);
    }
}
