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


Route::get('/faq', function () {
    return Inertia::render('Faq', []);
});

Route::get('/refund-policy', function () {
    return Inertia::render('RefundPolicy', []);
});

Route::get('/term-condition', function () {
    return Inertia::render('TermCondition', []);
});

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
Route::middleware([])->group(function () {
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
Route::middleware([])->group(function () {
    Route::get('/cities/{provinceId}', [ShippingController::class, 'getCities']);
    Route::get('/districts/{cityId}', [ShippingController::class, 'getDistricts']);
    Route::post('/shipping/calculate-cost', [ShippingController::class, 'calculateCost'])
        ->name('shipping.calculate-cost');
});

require __DIR__.'/auth.php';
