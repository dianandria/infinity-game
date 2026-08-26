<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Product;
use App\Models\Slider;
use App\Models\Category;
use App\Observers\ProductObserver;
use App\Observers\SliderObserver;
use App\Observers\CategoryObserver;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Product::observe(ProductObserver::class);
        Slider::observe(SliderObserver::class);
        Category::observe(CategoryObserver::class);

        // Share category to all views
        Inertia::share('headerCategories', function () {
            $categoryOrder = ['Xbox', 'Playstation', 'Nintendo', 'Blu-Ray & Movie', 'Video Games', 'Voucher Games'];

            return Category::whereIn('name', $categoryOrder)
                ->get(['id', 'name', 'slug'])
                ->sortBy(fn ($category) => array_search($category->name, $categoryOrder))
                ->values();
        });
    }
}
