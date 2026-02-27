<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SliderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isStore = $this->isMethod('post');

        $imageRule = $isStore ? 'required' : 'nullable';

        return [
            'title'        => ['required', 'string', 'max:255'],
            'subtitle'     => ['nullable', 'string', 'max:255'],
            'button_text'  => ['nullable', 'string', 'max:255'],
            'button_link'  => ['nullable', 'string', 'max:255'],
            'sort_order'   => ['nullable', 'integer'],
            'is_active'    => ['sometimes', 'boolean'],
            'image'        => [$imageRule, 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        // Optional, kalau mau custom message (bisa pakai ID juga)
        return [
            'title.required' => 'Title is required.',
            'image.required' => 'Image is required for new slider.',
            'image.image'    => 'File must be a valid image.',
        ];
    }

    /**
     * Opsional: bersihkan data sebelum dipakai di controller
     */
    public function validatedWithCast(): array
    {
        $data = $this->validated();

        // checkbox: kadang tidak terkirim kalau unchecked
        $data['is_active'] = (bool) ($data['is_active'] ?? false);

        // default sort order
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }
}
