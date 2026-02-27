<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'product_key',
        'sku',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image_url',
        'is_featured',
        'featured_order',
    ];
    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'featured_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected static function booted() {
        static::saving(function ($m) {
            if (blank($m->slug)) $m->slug = Str::slug($m->name);
        });
    }

    public function categories() {
        return $this->belongsToMany(Category::class);
    }

    public function images() {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function mainImage() {
        return $this->hasOne(ProductImage::class)->where('is_main', true);
    }
}
