<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name','slug', 'description','banner_path','order'];
    protected $appends = ['banner_url'];

    protected static function booted() {
        static::saving(function ($m) {
            if (blank($m->slug)) $m->slug = Str::slug($m->name);
        });
    }

    public function products() {
        return $this->belongsToMany(Product::class);
    }

    public function getBannerUrlAttribute()
    {
        return $this->banner_path
            ? Storage::url($this->banner_path)
            : null;
    }

    // public function getRouteKeyName(): string
    // {
    //     return 'slug';
    // }
}
