<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // guest = null
            $table->string('code')->unique(); // mis. ORD-20251105-ABC123
            // customer info (guest or user prefill)
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();

            // shipping address (MVP: json)
            $table->json('shipping_address');

            // amounts (integer rupiah)
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('shipping_fee')->default(0);
            $table->unsignedInteger('discount')->default(0);
            $table->unsignedInteger('total');

            // payment
            $table->string('payment_provider')->nullable(); // 'midtrans', 'xendit', 'manual'
            $table->string('payment_ref')->nullable();      // snap_token / invoice_id
            $table->string('status')->default('pending');   // pending|paid|failed|cancelled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
