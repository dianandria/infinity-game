<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        $id = $this->route('product')?->id;
        return [
            'name'         => ['required','string','max:255'],
            'slug'         => ['nullable','string','max:255',"unique:products,slug,$id"],
            'description'  => ['nullable','string'],
            'price'        => ['required','integer','min:0'],
            'stock'        => ['required','integer','min:0'],
            'image_url'    => ['nullable','string','max:2048'],
            'category_ids' => ['array'],
            'category_ids.*'=> ['integer','exists:categories,id'],

            // CREATE: kirim "images[]" & "main_image_index" (index file di images)
            'images'            => ['sometimes','array'],
            'images.*'          => ['file','image','mimes:jpg,jpeg,png,webp,avif','max:500'],
            'main_image_index'  => ['nullable','integer','min:0'],

            // UPDATE:
            'remove_image_ids'  => ['sometimes','array'],
            'remove_image_ids.*'=> ['integer','exists:product_images,id'],
            'main_image_id'     => ['nullable','integer','exists:product_images,id'],
            'sort'              => ['sometimes','array'], // optional: urutan
            // sort contoh: [{id: 12, order: 0}, {id: 9, order: 1}]

            // FEATURED PRODUCT
            'is_featured'    => ['sometimes', 'boolean'],
            'featured_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
