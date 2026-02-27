<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryPageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\IpaymuWebhookController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\OrderController as UserOrderController;
use App\Http\Controllers\Admin\AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\AdminContactController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Home
Route::get('/', [HomeController::class, 'index'])->name('home.index');

// Product per Category
Route::get('/category/{category:slug}', [CategoryPageController::class, 'show'])
    ->name('category.show');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store'); // add
Route::patch('/cart/{product}', [CartController::class, 'update'])->name('cart.update'); // qty
Route::delete('/cart/{product}', [CartController::class, 'destroy'])->name('cart.destroy'); // remove
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear'); // empty

// Checkout
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout',  [CheckoutController::class, 'create'])->name('checkout.create');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/thank-you/{order}', [CheckoutController::class, 'thankyou'])->name('checkout.thankyou');
    Route::get('/checkout/pay/{order}', [CheckoutController::class, 'pay'])->name('checkout.pay');
    Route::get('/checkout/failed/{order}', [CheckoutController::class, 'failed'])
    ->name('checkout.failed');

    // ORDER
    Route::get('/dashboard', [UserOrderController::class, 'index'])->name('dashboard');
    Route::get('/orders/{order}', [UserOrderController::class, 'show'])->name('orders.show');

    // Endpoint JSON untuk tracking
    Route::get('/orders/{order}/tracking', [UserOrderController::class, 'tracking'])
        ->name('orders.tracking');
});

// Contact
Route::get('/contact', [ContactController::class, 'create'])
    ->name('contact.create');

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:1,1')
    ->name('contact.store');

// Page
Route::get('/about', [PageController::class, 'about'])
    ->name('about');

// Shipping
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cities/{provinceId}', [ShippingController::class, 'getCities']);
    Route::get('/districts/{cityId}', [ShippingController::class, 'getDistricts']);
    Route::post('/shipping/calculate-cost', [ShippingController::class, 'calculateCost'])
        ->name('shipping.calculate-cost');
});

/**
 * Admin (guard admin)
 */
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest.admin')->group(function () {
        Route::get('/login', [AdminAuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AdminAuthenticatedSessionController::class, 'store'])->name('login.store');
    });

    Route::middleware('auth:admin')->group(function () {
        // Route::get('/dashboard', fn() => Inertia::render('Dashboard/Index'))
        //    ->name('dashboard');
        Route::get('/dashboard', function () {
            return redirect('/admin/orders'); // Redirects to a specific URL path
        })->name('dashboard');

        Route::post('/logout', [AdminAuthenticatedSessionController::class, 'destroy'])->name('logout');

        // Product & Categories
        Route::resource('products', AdminProductController::class);
        Route::delete('/admin/products/batch', [AdminProductController::class, 'batchDestroy'])
            ->name('products.batchDestroy');
         Route::post('/admin/products/import', [AdminProductController::class, 'importExcel'])
            ->name('products.importExcel');

        Route::resource('categories', CategoryController::class)->except('show');

        // Order
        Route::get('orders',           [OrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}',   [OrderController::class, 'show'])->name('orders.show');
        Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
        Route::get('orders-export',    [OrderController::class, 'export'])->name('orders.export');
        Route::post('/orders/{order}/shipping', [OrderController::class, 'updateShipping'])
            ->name('orders.shipping');

        // Slider
        Route::resource('sliders', SliderController::class);

        // Contact Message
        Route::get('contact', [AdminContactController::class, 'index'])->name('contact');
    });
});

require __DIR__.'/auth.php';
