<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Imports\ProductsWorkbookImport;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index(Request $request) {
        $search = $request->string('search');
        $products = Product::with('categories:id,name,slug')
            ->when($search, fn($q)=>$q->where(function($qq) use($search){
                $qq->where('name','like',"%$search%")
                   ->orWhere('slug','like',"%$search%");
            }))
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters'  => ['search'=>$search],
        ]);
    }

    public function create() {
        return Inertia::render('Products/Form', [
            'product'    => null,
            'categories' => Category::orderBy('name')->get(['id','name']),
        ]);
    }

    public function store(ProductRequest $request) {
        $validated = $request->validated();

        // Buat product dulu (tanpa image_url)
        $product = Product::create(collect($validated)->only([
            'name','slug','description','price','stock'
        ])->toArray());

        // Kategori
        $product->categories()->sync($request->input('category_ids', []));

        // Upload images (jika ada)
        $uploaded = [];
        foreach ($request->file('images', []) as $i => $file) {
            $path = $file->store("products/{$product->id}", 'public');
            $uploaded[] = ProductImage::create([
                'product_id' => $product->id,
                'path'       => $path,
                'is_main'    => false,
                'sort_order' => $i,
            ]);
        }

        // Set main image via index
        $mainIndex = $request->integer('main_image_index', null);
        if (!is_null($mainIndex) && isset($uploaded[$mainIndex])) {
            foreach ($uploaded as $img) {
                $img->update(['is_main' => false]);
            }
            $uploaded[$mainIndex]->update(['is_main' => true]);

            // update kolom image_url untuk kompatibilitas
            $product->update(['image_url' => Storage::url($uploaded[$mainIndex]->path)]);
        } elseif (!empty($uploaded)) {
            // default: pertama jadi main
            $uploaded[0]->update(['is_main' => true]);
            $product->update(['image_url' => Storage::url($uploaded[0]->path)]);
        }

        return back()->with('success', 'Product created');
    }

    public function edit(Product $product) {
        $product->load('categories:id');
        // var_dump(json_encode($product->load('images:id,product_id,is_main,sort_order,path'))); die();
        return Inertia::render('Products/Form', [
            'product' => $product->load('images:id,product_id,is_main,sort_order,path'),
            'categories' => Category::select('id','name')->get(),
        ]);
    }

    public function update(ProductRequest $request, Product $product) {
        $validated = $request->validated();

        // Update basic
        $product->update(collect($validated)->only([
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'is_featured',
            'featured_order',
        ])->toArray());

        $product->categories()->sync($request->input('category_ids', []));

        // Hapus images yang di-remove
        $removeIds = $request->input('remove_image_ids', []);
        if (!empty($removeIds)) {
            $toDelete = $product->images()->whereIn('id', $removeIds)->get();
            foreach ($toDelete as $img) {
                Storage::disk('public')->delete($img->path);
                $img->delete();
            }
        }

        // Upload gambar baru
        $newImages = [];
        foreach ($request->file('images', []) as $i => $file) {
            $path = $file->store("products/{$product->id}", 'public');
            $newImages[] = ProductImage::create([
                'product_id' => $product->id,
                'path'       => $path,
                'is_main'    => false,
                'sort_order' => $product->images()->count() + $i,
            ]);
        }

        // Urutkan (opsional)
        $sort = $request->input('sort', []); // array of {id, order}
        if (!empty($sort)) {
            foreach ($sort as $row) {
                $product->images()->where('id', $row['id'])->update([
                    'sort_order' => (int) $row['order']
                ]);
            }
        }

        // Set main image
        $mainId = $request->input('main_image_id');
        if ($mainId) {
            // pastikan mainId milik product ini
            $img = $product->images()->where('id', $mainId)->first();
            if ($img) {
                $product->images()->update(['is_main' => false]);
                $img->update(['is_main' => true]);
                $product->update(['image_url' => Storage::url($img->path)]);
            }
        } else {
            // Jika tidak ada main & masih ada image, set pertama sebagai main
            if (!$product->mainImage()->exists() && $product->images()->exists()) {
                $first = $product->images()->first();
                $first->update(['is_main' => true]);
                $product->update(['image_url' => Storage::url($first->path)]);
            }
        }

        return back()->with('success','Product updated');
    }

    public function destroy(Product $product) {
        $product->delete();
        return back()->with('success','Product deleted');
    }

    public function batchDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:products,id'],
        ]);

        $ids = $validated['ids'];

        Product::whereIn('id', $ids)->update([
            'is_active' => false
        ]);

        Product::whereIn('id', $ids)->delete();

        return back()->with('success', count($ids) . ' product(s) deleted.');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:20480'], // 20MB
        ]);

        Excel::import(new ProductsWorkbookImport, $request->file('file'));

        return back()->with('success', 'Import completed.');
}
}
