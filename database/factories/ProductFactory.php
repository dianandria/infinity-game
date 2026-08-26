<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(5),
            'sku' => strtoupper(Str::random(8)),
            'description' => $this->faker->sentence(12),
            'price' => $this->faker->numberBetween(10000, 250000),
            'stock' => $this->faker->numberBetween(0, 120),
            'image_url' => 'https://picsum.photos/seed/'.Str::random(6).'/600/600',
        ];
    }
}
