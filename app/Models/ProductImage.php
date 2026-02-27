<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = ['product_id','path','is_main','sort_order','meta'];
    protected $casts = [
        'is_main' => 'boolean',
        'sort_order' => 'integer',
        'meta' => 'array',
    ];
    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return \Storage::disk('public')->url($this->path);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
