<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    protected $fillable = ['product_id','path','is_main','sort_order','meta'];
    protected $casts = [
        'is_main' => 'boolean',
        'sort_order' => 'integer',
        'meta' => 'array',
    ];
    
    protected $appends = ['url'];

    public function getUrlAttribute(): ?string
    {
        $path = $this->path;

        if (!$path) {
            return null;
        }

        // Kalau sudah full URL
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        // Kalau path lokal / relative
        return asset('storage/' . ltrim($path, '/'));
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
