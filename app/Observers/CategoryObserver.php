<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Facades\Storage;


class CategoryObserver
{
    /**
     * Handle the Category "updated" event.
     */
    public function updated(Category $category): void
    {
        // cek apakah kolom banner_path berubah
        if ($category->isDirty('banner_path')) {
            $oldPath = $category->getOriginal('banner_path');

            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleted(Category $category): void
    {
        if ($category->banner_path && Storage::disk('public')->exists($category->banner_path)) {
            Storage::disk('public')->delete($category->banner_path);
        }
    }
}
