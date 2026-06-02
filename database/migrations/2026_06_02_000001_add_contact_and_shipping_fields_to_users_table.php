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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email_verified_at');
            $table->string('address')->nullable()->after('phone');
            $table->unsignedBigInteger('province_id')->nullable()->after('address');
            $table->string('province')->nullable()->after('province_id');
            $table->unsignedBigInteger('city_id')->nullable()->after('province');
            $table->string('city')->nullable()->after('city_id');
            $table->unsignedBigInteger('district_id')->nullable()->after('city');
            $table->string('district')->nullable()->after('district_id');
            $table->string('postal_code', 15)->nullable()->after('district');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'address',
                'province_id',
                'province',
                'city_id',
                'city',
                'district_id',
                'district',
                'postal_code',
            ]);
        });
    }
};
