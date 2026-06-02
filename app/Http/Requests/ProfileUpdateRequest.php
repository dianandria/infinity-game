<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::in([$this->user()->email]),
            ],
            'phone' => ['nullable', 'string', 'min:10', 'max:15', 'regex:/^(0|62)[0-9]+$/'],
            'address' => ['nullable', 'string', 'max:240'],
            'province_id' => ['nullable', 'integer', 'min:0'],
            'province' => ['nullable', 'string', 'max:120'],
            'city_id' => ['nullable', 'integer', 'min:0'],
            'city' => ['nullable', 'string', 'max:120'],
            'district_id' => ['nullable', 'integer', 'min:0'],
            'district' => ['nullable', 'string', 'max:120'],
            'postal_code' => ['nullable', 'string', 'max:15'],
        ];
    }
}
