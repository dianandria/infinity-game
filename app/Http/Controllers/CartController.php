<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    protected function mapCart(array $cart): array
    {
        $items = collect($cart)->values()->map(function ($it) {
            $it['subtotal'] = $it['price'] * $it['qty'];
            return $it;
        });

        $subtotal = (int) $items->sum('subtotal');
        $shipping = 0;
        $total    = $subtotal + $shipping;

        return [
            'items'    => $items->toArray(),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total'    => $total,
        ];
    }

    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []);
        return Inertia::render('Cart/Index', [
            'cart' => $this->mapCart($cart),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required','integer','exists:products,id'],
            'qty'        => ['nullable','integer','min:1'],
        ]);
        $qty = $data['qty'] ?? 1;

        $product = Product::findOrFail($data['product_id']);

        $cart = $request->session()->get('cart', []);
        $line = $cart[$product->id] ?? [
            'product_id' => $product->id,
            'slug'       => $product->slug,
            'name'       => $product->name,
            'price'      => (int) $product->price,
            'image_url'  => $product->image_url,
            'stock'      => (int) $product->stock,
            'qty'        => 0,
        ];

        $line['qty'] = min(($line['qty'] + $qty), max(1, (int)$product->stock));
        $cart[$product->id] = $line;

        $request->session()->put('cart', $cart);

        return back()->with('success', 'Added to cart');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'qty' => ['required','integer','min:1'],
        ]);

        $cart = $request->session()->get('cart', []);
        if (!isset($cart[$product->id])) {
            return back()->with('error', 'Item not in cart');
        }
        $cart[$product->id]['qty'] = min($data['qty'], max(1, (int)$product->stock));
        $request->session()->put('cart', $cart);

        return back()->with('success', 'Cart updated');
    }

    public function destroy(Request $request, Product $product)
    {
        $cart = $request->session()->get('cart', []);
        unset($cart[$product->id]);
        $request->session()->put('cart', $cart);

        return back()->with('success', 'Item removed');
    }

    public function clear(Request $request)
    {
        $request->session()->forget('cart');
        return back()->with('success', 'Cart cleared');
    }
}
