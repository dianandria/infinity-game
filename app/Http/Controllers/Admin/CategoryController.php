<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request) {
        $search = $request->string('search');
        $categories = Category::when($search, fn($q)=>$q->where('name','like',"%$search%"))
            ->orderBy('order')->paginate(10)->withQueryString();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters'    => ['search'=>$search],
        ]);
    }

    public function create() {
        return Inertia::render('Categories/Form', ['category'=>null]);
    }

    public function store(CategoryRequest $request) {
        $validated = $request->validated();

        // handle upload banner jika ada
        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('categories', 'public');
            $validated['banner_path'] = $path;
        }

        // jangan simpan field 'banner' (file) ke DB
        unset($validated['banner']);

        Category::create($validated);
        return back()->with('success','Category created');
    }

    public function edit(Category $category) {
        return Inertia::render('Categories/Form', ['category'=>$category]);
    }

    public function update(CategoryRequest $request, Category $category) {
        $validated = $request->validated();

        if ($request->hasFile('banner')) {
            // hapus banner lama jika ada
            if ($category->banner_path && Storage::disk('public')->exists($category->banner_path)) {
                Storage::disk('public')->delete($category->banner_path);
            }

            $path = $request->file('banner')->store('categories', 'public');
            $validated['banner_path'] = $path;
        }

        unset($validated['banner']);

        $category->update($validated);
        return back()->with('success','Category updated');
    }

    public function destroy(Category $category) {
        $category->delete();
        return back()->with('success','Category deleted');
    }
}
