<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IpaymuWebhookController;

Route::post('/payment/ipaymu/notify', [IpaymuWebhookController::class, 'handle'])
    ->name('ipaymu.notify');