<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Slider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InfinityGamesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Xbox', 'slug' => 'xbox', 'banner_path' => 'categories/xbox.jpg', 'order' => 1],
            ['name' => 'Playstation', 'slug' => 'playstation', 'banner_path' => 'categories/playstation.png', 'order' => 2],
            ['name' => 'Nintendo', 'slug' => 'nintendo', 'banner_path' => 'categories/nintendo.jpg', 'order' => 3],
            ['name' => 'Blu-Ray & Movie', 'slug' => 'blu-ray-movie', 'banner_path' => 'categories/blu-ray-movie.jpg', 'order' => 4],
            ['name' => 'Video Games', 'slug' => 'video-games', 'banner_path' => 'categories/video-games.jpg', 'order' => 5],
            ['name' => 'Voucher Games', 'slug' => 'voucher-games', 'banner_path' => 'categories/voucher-games.jpg', 'order' => 6],
        ];

        $categoryModels = [];
        foreach ($categories as $data) {
            $categoryModels[$data['slug']] = Category::create($data);
        }

        $products = [
            // Xbox
            ['cat' => 'xbox', 'name' => 'Xbox Series X 1TB Console - Black', 'price' => 8500000, 'stock' => 15, 'image' => 'xboxSeriesx.jpg', 'featured' => true],
            ['cat' => 'xbox', 'name' => 'Xbox Wireless Controller - Carbon Black', 'price' => 950000, 'stock' => 30, 'image' => 'xboxController.jpg'],
            ['cat' => 'xbox', 'name' => 'Xbox One S 500GB Console - White', 'price' => 4500000, 'stock' => 0, 'image' => 'xboxOneS.jpg'],
            ['cat' => 'xbox', 'name' => 'Forza Horizon 6 - Xbox Series X/S', 'price' => 850000, 'stock' => 25, 'image' => 'fh6.jpg'],

            // Playstation
            ['cat' => 'playstation', 'name' => 'PlayStation 5 Pro 1TB', 'price' => 12500000, 'stock' => 0, 'image' => 'image5.png'],
            ['cat' => 'playstation', 'name' => 'Playstation 5 825GB Console - Digital Edition', 'price' => 7500000, 'stock' => 12, 'image' => 'image5.png', 'featured' => true],
            ['cat' => 'playstation', 'name' => 'Sony PS5 Slim Disc Digital Version', 'price' => 10349000, 'stock' => 10, 'image' => 'image5.png'],
            ['cat' => 'playstation', 'name' => 'Playstation Wireless Controller - Carbon Black', 'price' => 950000, 'stock' => 40, 'image' => 'image1.png'],
            ['cat' => 'playstation', 'name' => 'PlayStation 4 Slim', 'price' => 4459000, 'stock' => 18, 'image' => 'ps4.jpg'],
            ['cat' => 'playstation', 'name' => 'Stick PS4 Dualshock Original', 'price' => 1598000, 'stock' => 22, 'image' => 'stikPs4.jpg'],
            ['cat' => 'playstation', 'name' => 'FIFA 18 - PlayStation 4', 'price' => 400000, 'stock' => 35, 'image' => 'fifa.jpg'],

            // Nintendo
            ['cat' => 'nintendo', 'name' => 'Nintendo Switch 2 32GB Console - Neon Red/Neon Blue', 'price' => 5500000, 'stock' => 20, 'image' => 'image3.png', 'featured' => true],
            ['cat' => 'nintendo', 'name' => 'Nintendo Switch OLED', 'price' => 6150000, 'stock' => 14, 'image' => 'switchOled.webp'],
            ['cat' => 'nintendo', 'name' => 'Pro Controller 2 Nintendo Switch 2 Original', 'price' => 1400000, 'stock' => 28, 'image' => 'controllerSwitch2.jpg'],
            ['cat' => 'nintendo', 'name' => 'Joycon Nintendo Switch OLED Original', 'price' => 1149000, 'stock' => 33, 'image' => 'joyconSwitch.webp'],
            ['cat' => 'nintendo', 'name' => 'The Legend Of Zelda: Tears of the Kingdom', 'price' => 850000, 'stock' => 27, 'image' => 'image4.png', 'featured' => true],

            // Blu-Ray & Movie
            ['cat' => 'blu-ray-movie', 'name' => 'F1 The Movie', 'price' => 500000, 'stock' => 40, 'image' => 'image6.png', 'featured' => true],
            ['cat' => 'blu-ray-movie', 'name' => 'Fast & Furious', 'price' => 420000, 'stock' => 30, 'image' => 'fast.webp'],
            ['cat' => 'blu-ray-movie', 'name' => 'X-Men', 'price' => 400000, 'stock' => 26, 'image' => 'xmen.jpg'],
            ['cat' => 'blu-ray-movie', 'name' => '1917', 'price' => 350000, 'stock' => 19, 'image' => '1917.jpg'],

            // Video Games
            ['cat' => 'video-games', 'name' => 'Elden Ring Shadow Of The Erdtree Edition', 'price' => 780000, 'stock' => 24, 'image' => 'image2.png', 'featured' => true],
            ['cat' => 'video-games', 'name' => 'Forza Horizon 5 - Xbox Series X/S', 'price' => 500000, 'stock' => 31, 'image' => 'fh5.webp'],

            // Voucher Games
            ['cat' => 'voucher-games', 'name' => 'Steam Wallet Code 10 USD', 'price' => 160000, 'stock' => 999, 'image' => 'image7.png', 'featured' => true],
            ['cat' => 'voucher-games', 'name' => 'Xbox Game Pass - 3 Bulan', 'price' => 250000, 'stock' => 999, 'image' => 'xboxGamepass.webp'],
            ['cat' => 'voucher-games', 'name' => 'Valorant Points (VP) - 8500 VP', 'price' => 800000, 'stock' => 999, 'image' => 'valow.webp'],
            ['cat' => 'voucher-games', 'name' => 'PlayStation Plus Subscription', 'price' => 235000, 'stock' => 0, 'image' => 'playstationCard.jpg'],
            ['cat' => 'voucher-games', 'name' => 'PlayStation Network Card - Rp 400.000', 'price' => 400000, 'stock' => 999, 'image' => 'playstationCard.jpg'],
        ];

        foreach ($products as $index => $data) {
            $slug = Str::slug($data['name']) . '-' . Str::lower(Str::random(5));

            $product = Product::create([
                'sku' => strtoupper(Str::random(8)),
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['name'] . '. Produk original dan bergaransi resmi, tersedia di Infinity Game.',
                'price' => $data['price'],
                'stock' => $data['stock'],
                'is_featured' => $data['featured'] ?? false,
                'featured_order' => $index,
                'is_active' => true,
            ]);

            $product->categories()->attach($categoryModels[$data['cat']]->id);

            ProductImage::create([
                'product_id' => $product->id,
                'path' => 'products/' . $data['image'],
                'is_main' => true,
                'sort_order' => 0,
            ]);
        }

        Slider::create([
            'placement' => 'home',
            'title' => "Koleksi Game Dan Layanan Terbaik, Tanpa Batas!",
            'subtitle' => 'INFINITY GAME',
            'image_path' => 'sliders/hero_image.png',
            'button_text' => 'Belanja Sekarang',
            'button_link' => '/products',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Slider::create([
            'placement' => 'home',
            'title' => 'Konsol PlayStation Terbaru Sudah Tersedia',
            'subtitle' => 'PLAYSTATION',
            'image_path' => 'sliders/ps-banner.png',
            'button_text' => 'Lihat Koleksi',
            'button_link' => '/category/playstation',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Slider::create([
            'placement' => 'home',
            'title' => 'Jelajahi Dunia Xbox Tanpa Batas',
            'subtitle' => 'XBOX',
            'image_path' => 'sliders/xbox-banner.png',
            'button_text' => 'Lihat Koleksi',
            'button_link' => '/category/xbox',
            'sort_order' => 3,
            'is_active' => true,
        ]);
    }
}
