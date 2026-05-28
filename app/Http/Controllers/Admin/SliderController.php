<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\SliderRequest;
use App\Models\Slider;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sliders = Slider::orderBy('sort_order')
            ->latest('id')
            ->paginate(10);

        return Inertia::render('Sliders/Index', [
            'sliders' => $sliders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sliders/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SliderRequest $request)
    {
        $data = $request->validatedWithCast();

        // upload image (wajib waktu store)
        $path = $request->file('image')->store('sliders', 'public');
        $data['image_path'] = $path;

        Slider::create($data);

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Slider $slider)
    {
        return Inertia::render('Sliders/Edit', [
            'slider' => $slider,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SliderRequest $request, Slider $slider)
    {
        $data = $request->validatedWithCast();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sliders', 'public');
            $data['image_path'] = $path;
        } else {
            // jangan overwrite image_path jadi null
            unset($data['image']);
        }

        $slider->update($data);

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slider $slider)
    {
        $slider->delete();

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider deleted.');
    }
}
